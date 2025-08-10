const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const nodemailer = require('nodemailer');
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

// Configurar Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


// Configurar axios com retry
const axiosInstance = axios.create({
  baseURL: 'https://api.pagseguro.com/checkout-sessions',
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
  const { nome, email, endereco, cpf, livroId, amount, paymentMethod, cardNumber, cardHolder, expirationDate, cvv } = req.body;

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
    if (paymentMethod.toLowerCase() === 'creditcard' && (!cardNumber || !cardHolder || !expirationDate || !cvv)) {
      console.log('Erro: Dados do cartão obrigatórios');
      return res.status(400).json({ error: 'Dados do cartão são obrigatórios' });
    }

    // Inserir pedido no banco
    console.log('Inserindo pedido no banco...');
    const result = await pool.query(
      `INSERT INTO pedidos (nome, email, endereco, cpf, livro_id, pagbank_order_id, data_pedido, payment_method, notified)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, false)
       RETURNING id`,
      [nome, email, endereco, cpf, livroId, 'PENDING', paymentMethod]
    );
    const pedidoId = result.rows[0].id;
    console.log('Pedido inserido com ID:', pedidoId);

    // Montar requisição pro PagBank
    console.log('Montando requisição para PagBank...');
    const paymentMethods = [{ type: paymentMethod.toUpperCase() }];
    if (paymentMethod.toLowerCase() === 'creditcard') {
      const [expMonth, expYear] = expirationDate.split('/');
      paymentMethods[0] = {
        type: 'CREDIT_CARD',
        card: {
          number: cardNumber.replace(/\s/g, ''),
          holder: { name: cardHolder },
          exp_month: parseInt(expMonth, 10),
          exp_year: parseInt(expYear, 10),
          security_code: cvv
        },
        installments: { max_number: 12 }
      };
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
      redirect_url: 'https://ebook-recomecos-frontend.onrender.com/?sucesso=1',
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
  console.log('Notificação recebida, corpo completo:', JSON.stringify(req.body, null, 2));
  try {
    // Ignorar notificações com corpo vazio
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log('Erro: Corpo da notificação vazio');
      return res.status(400).json({ error: 'Corpo da notificação vazio' });
    }

    // Extrair status e reference_id do corpo
    const { reference_id, charges } = req.body;
    if (!reference_id || !charges || !charges[0]) {
      console.log('Erro: Dados insuficientes na notificação', { reference_id, hasCharges: !!charges });
      return res.status(400).json({ error: 'Dados insuficientes na notificação' });
    }

    const status = charges[0].status;
    const notificationId = charges[0].payment_method?.pix?.notification_id;
    const pedidoId = reference_id.split('_')[1];

    console.log('Processando notificação:', { notificationId, status, pedidoId });

    // Verificar se pedido existe
    const pedido = await pool.query('SELECT notified, pagbank_order_id FROM pedidos WHERE id = $1', [pedidoId]);
    if (!pedido.rows.length) {
      console.log('Erro: Pedido não encontrado para reference_id:', reference_id);
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    if (pedido.rows[0].notified) {
      console.log('Pedido já notificado, ignorando:', pedidoId);
      return res.status(200).send('Notificação já processada');
    }

    // Atualizar status e notified no banco
    console.log('Atualizando status do pedido:', { pedidoId, status });
    await pool.query(
      'UPDATE pedidos SET status = $1, notified = true WHERE id = $2',
      [status, pedidoId]
    );

    // Enviar e-mail se status for PAID
    if (status === 'PAID') {
      console.log('Status PAID, enviando e-mail pro solicitante...');
      const pedidoData = await pool.query('SELECT * FROM pedidos WHERE id = $1', [pedidoId]);
      const { nome, email, cpf, endereco, livro_id, payment_method, data_pedido } = pedidoData.rows[0];

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: `Novo Pedido Confirmado - E-book Recomeços (ID: ${pedidoId})`,
        text: `
          Novo pedido confirmado para o E-book Recomeços!
          
          Detalhes do Cliente:
          - Nome: ${nome}
          - E-mail: ${email}
          - CPF: ${cpf}
          - Endereço: ${endereco}
          - Método de Pagamento: ${payment_method}
          - ID do Livro: ${livro_id}
          - Data do Pedido: ${data_pedido.toISOString()}
          
          Por favor, envie o e-book manualmente para o e-mail do cliente: ${email}.
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('E-mail enviado pro solicitante:', process.env.EMAIL_TO);
    }

    res.status(200).send('Notificação recebida');
  } catch (err) {
    console.error('Erro na notificação:', {
      message: err.message,
      code: err.code,
      status: err.response?.status,
      data: err.response?.data,
      headers: err.response?.headers
    });
    return res.status(500).json({ error: 'Erro ao processar notificação', details: err.message });
  }
});

// Iniciar servidor
app.listen(port, async () => {
  console.log(`Servidor rodando no ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Porta: ${port}`);
  console.log(`PAGBANK_TOKEN: ${process.env.PAGBANK_TOKEN ? 'definido' : 'não definido'}`);
  console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? 'definido' : 'não definido'}`);
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? 'definido' : 'não definido'}`);
  console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? 'definido' : 'não definido'}`);
  console.log(`EMAIL_TO: ${process.env.EMAIL_TO ? 'definido' : 'não definido'}`);
  try {
    console.log('Conectando ao banco...');
    await pool.query('SELECT 1');
    console.log('Conexão com o banco OK');
  } catch (err) {
    console.error('Erro na conexão com o banco:', err.message);
  }
  try {
    console.log('Testando conexão com Nodemailer...');
    await transporter.verify();
    console.log('Conexão com Nodemailer OK');
  } catch (err) {
    console.error('Erro na conexão com Nodemailer:', err.message);
  }
  console.log(`Servidor rodando na porta ${port}`);
});