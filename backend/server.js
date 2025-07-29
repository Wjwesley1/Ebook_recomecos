const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const axios = require('axios');
const axiosRetry = require('axios-retry').default;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Configurar CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'https://ebook-recomecos-frontend.onrender.com'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());

// Configurar conexão com o banco
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Configurar axios com retry
const axiosInstance = axios.create({
  baseURL: 'https://sandbox.api.pagseguro.com/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${process.env.PAGBANK_TOKEN}`,
    'User-Agent': 'Ebook-Recomecos-Backend/1.0.0'
  }
});

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition: (error) => error.code === 'ENOTFOUND' || error.response?.status === 429 || axiosRetry.isNetworkOrIdempotentRequestError(error)
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Requisição em /api/health:', { origin: req.get('Origin') });
  res.json({ status: 'OK' });
});

// Debug DNS endpoint
app.get('/api/debug-dns', async (req, res) => {
  const { exec } = require('child_process');
  exec('nslookup sandbox.api.pagseguro.com', (error, stdout, stderr) => {
    if (error) {
      console.error('Erro no nslookup:', error);
      return res.status(500).json({ error: 'Erro ao resolver DNS', details: stderr });
    }
    res.json({ result: stdout });
  });
});

// Validação de CPF
const validateCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
  let rest = 11 - (sum % 11);
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.charAt(9))) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
  rest = 11 - (sum % 11);
  if (rest === 10 || rest === 11) rest = 0;
  return rest === parseInt(cpf.charAt(10));
};

// Endpoint para criar pedido
app.post('/api/pedido', async (req, res) => {
  console.log('Requisição POST em /api/pedido:', { origin: req.get('Origin'), body: req.body });
  const { nome, email, endereco, cpf, livroId, amount, paymentMethod } = req.body;

  try {
    // Validação
    if (!nome || !email || !endereco || !cpf || !livroId || !amount || !paymentMethod) {
      console.log('Erro: Campos obrigatórios faltando');
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    if (!validateCPF(cpf)) {
      console.log('Erro: CPF inválido');
      return res.status(400).json({ error: 'CPF inválido' });
    }

    // Inserir pedido no banco
    console.log('Inserindo pedido no banco...');
    const result = await pool.query(
      `INSERT INTO pedidos (nome, email, endereco, cpf, livro_id, pagbank_order_id, data_pedido)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id`,
      [nome, email, endereco, cpf, livroId, 'PENDING']
    );
    const pedidoId = result.rows[0].id;
    console.log('Pedido inserido com ID:', pedidoId);

    // Montar requisição pro PagBank
    console.log('Montando requisição para PagBank...');
    const paymentMethods = [{ type: paymentMethod.toUpperCase() }];
    if (paymentMethod.toLowerCase() === 'creditcard') {
      paymentMethods[0].installments = { max_number: 12 };
    }
    const requestBody = {
      reference_id: `PEDIDO_${pedidoId}`,
      customer: {
        name: nome,
        email: email,
        tax_id: cpf.replace(/[^\d]+/g, ''),
        address: {
          street: endereco.split(',')[0]?.trim() || 'Rua Exemplo',
          number: endereco.split(',')[1]?.trim() || '123',
          district: endereco.split(',')[2]?.trim() || 'Centro',
          city: endereco.split(',')[3]?.trim() || 'São Paulo',
          state: endereco.split(',')[4]?.trim() || 'SP',
          country: 'BRA',
          postal_code: '01452002'
        }
      },
      items: [
        {
          name: 'Ebook Recomeços',
          unit_amount: Math.round(amount * 100),
          quantity: 1
        }
      ],
      payment_methods: paymentMethods,
      redirect_url: 'https://ebook-recomecos-frontend.onrender.com',
      notification_urls: ['https://ebook-recomecos-backend.onrender.com/api/notificacao'],
      payment_notification_urls: ['https://ebook-recomecos-backend.onrender.com/api/notificacao']
    };

    console.log('Corpo da requisição para PagBank:', JSON.stringify(requestBody, null, 2));

    // Enviar requisição pro PagBank
    console.log('Enviando requisição para PagBank...');
    const pagbankResponse = await axiosInstance.post('checkouts', requestBody);
    console.log('Resposta do PagBank:', pagbankResponse.data);
    const { id: pagbankOrderId, links } = pagbankResponse.data;
    const paymentUrl = links.find((link) => link.rel === 'PAY')?.href;

    if (!paymentUrl) {
      console.log('Erro: Link de pagamento não encontrado');
      throw new Error('Link de pagamento não retornado pelo PagBank');
    }

    // Atualizar pedido com pagbank_order_id
    console.log('Atualizando pedido com pagbank_order_id:', pagbankOrderId);
    await pool.query(
      'UPDATE pedidos SET pagbank_order_id = $1 WHERE id = $2',
      [pagbankOrderId, pedidoId]
    );

    res.json({
      id: pedidoId,
      nome,
      email,
      endereco,
      cpf,
      livro_id: livroId,
      pagbank_order_id: pagbankOrderId,
      data_pedido: new Date().toISOString(),
      payment_url: paymentUrl
    });
  } catch (err) {
    console.error('Erro ao criar pedido:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
      headers: err.response?.headers
    });
    if (err.response?.status === 403) {
      return res.status(500).json({ error: 'Acesso bloqueado pelo PagBank. Verifique o token ou restrições de IP.' });
    }
    if (err.response?.status === 400) {
      return res.status(400).json({ error: 'Dados inválidos enviados ao PagBank', details: err.response.data });
    }
    return res.status(500).json({ error: 'Erro ao criar pedido', details: err.message });
  }
});

// Endpoint de notificação do PagBank
app.post('/api/notificacao', async (req, res) => {
  const { notificationCode } = req.body;
  try {
    console.log('Notificação recebida:', notificationCode);
    const response = await axiosInstance.get(`checkouts/notifications/${notificationCode}`);
    const { status, reference_id } = response.data;
    console.log('Atualizando status do pedido:', { status, reference_id });
    const pedidoId = reference_id.split('_')[1];
    await pool.query(
      'UPDATE pedidos SET status = $1 WHERE id = $2',
      [status, pedidoId]
    );
    res.status(200).send('Notificação recebida');
  } catch (err) {
    console.error('Erro na notificação:', err.response?.data || err.message);
    res.status(500).send('Erro ao processar notificação');
  }
});

// Iniciar servidor
app.listen(port, async () => {
  console.log(`Servidor rodando no ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Porta: ${port}`);
  console.log(`PAGBANK_TOKEN: ${process.env.PAGBANK_TOKEN ? 'definido' : 'não definido'}`);
  console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? 'definido' : 'não definido'}`);
  try {
    console.log('Conectando ao banco...');
    await pool.query('SELECT 1');
    console.log('Conexão com o banco OK');
  } catch (err) {
    console.error('Erro na conexão com o banco:', err.message);
  }
  console.log(`Servidor rodando na porta ${port}`);
});