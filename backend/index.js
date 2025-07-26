const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const axios = require('axios');
const axiosRetry = require('axios-retry').default;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware manual para CORS (fallback)
app.use((req, res, next) => {
  const origin = req.get('Origin');
  const allowedOrigins = ['http://localhost:3000', 'https://ebook-recomecos-frontend.onrender.com'];
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
  }
  if (req.method === 'OPTIONS') {
    console.log('Requisição OPTIONS manual recebida:', { origin, headers: req.headers });
    return res.sendStatus(204);
  }
  next();
});

// Configurar CORS com middleware cors
const corsOptions = {
  origin: ['http://localhost:3000', 'https://ebook-recomecos-frontend.onrender.com'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Rota explícita para OPTIONS /api/pedido
app.options('/api/pedido', cors(corsOptions), (req, res) => {
  console.log('Requisição OPTIONS específica recebida em /api/pedido:', { origin: req.get('Origin'), headers: req.headers });
  res.sendStatus(204);
});

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
  console.log('Requisição recebida em /api/health', { origin: req.get('Origin') });
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

// Endpoint para criar pedido
app.post('/api/pedido', async (req, res) => {
  console.log('Requisição POST recebida em /api/pedido:', { origin: req.get('Origin') });
  const { nome, email, endereco, cpf, livroId, amount, paymentMethod } = req.body;

  try {
    console.log('Dados recebidos em /api/pedido:', { nome, email, endereco, cpf, livroId, amount, paymentMethod });
    if (!nome || !email || !endereco || !cpf || !livroId || !amount || !paymentMethod) {
      console.log('Erro: Campos obrigatórios faltando');
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    console.log('Inserindo pedido no banco...');
    const result = await pool.query(
      `INSERT INTO pedidos (nome, email, endereco, cpf, livro_id, pagbank_order_id, data_pedido)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id`,
      [nome, email, endereco, cpf, livroId, 'PENDING']
    );
    const pedidoId = result.rows[0].id;
    console.log('Pedido inserido com ID:', pedidoId);

    console.log('Montando requisição para PagBank...');
    const paymentMethods = [{ type: paymentMethod.toUpperCase() }];
    if (paymentMethod === 'creditCard') {
      paymentMethods[0].installments = { max_number: 12 };
    }
    const requestBody = {
      reference_id: `PEDIDO_${pedidoId}`,
      customer: {
        name: nome,
        email: email,
        tax_id: cpf,
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
      payment_methods: paymentMethod === 'pix' ? [{ type: 'BOLETO' }] : paymentMethods,
      redirect_url: 'https://ebook-recomecos-frontend.onrender.com',
      notification_urls: ['https://ebook-recomecos-backend.onrender.com/api/notificacao'],
      payment_notification_urls: ['https://ebook-recomecos-backend.onrender.com/api/notificacao']
    };

    console.log('Corpo da requisição para PagBank:', JSON.stringify(requestBody, null, 2));

    console.log('Enviando requisição para PagBank...');
    try {
      const pagbankResponse = await axiosInstance.post('checkouts', requestBody);
      console.log('Resposta do PagBank:', pagbankResponse.data);
      const { id: pagbankOrderId, links } = pagbankResponse.data;
      const paymentUrl = links.find((link) => link.rel === 'PAY')?.href;

      if (!paymentUrl) {
        console.log('Erro: Link de pagamento não encontrado');
        throw new Error('Link de pagamento não retornado pelo PagBank');
      }

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
    } catch (pagbankError) {
      console.error('Erro na requisição ao PagBank:', {
        message: pagbankError.message,
        status: pagbankError.response?.status,
        data: pagbankError.response?.data,
        headers: pagbankError.response?.headers
      });
      if (pagbankError.response?.status === 403) {
        return res.status(500).json({ error: 'Acesso bloqueado pelo PagBank. Verifique o token ou restrições de IP.' });
      }
      throw pagbankError;
    }
  } catch (err) {
    console.error('Erro ao criar pedido:', err.message);
    res.status(500).json({ error: 'Erro ao criar pedido' });
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
  try {
    await pool.query('SELECT 1');
    console.log('Conexão com o banco estabelecida com sucesso');
  } catch (err) {
    console.error('Erro na conexão com o banco:', err.message);
  }
  console.log(`Servidor rodando na porta ${port}`);
});