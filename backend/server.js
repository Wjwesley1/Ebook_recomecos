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
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

// Configurar conexão com o banco
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Configurar Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Configurar axios com retry
const axiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'User-Agent': 'Ebook-Recomecos-Backend/1.0.0',
  },
});

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition: (error) => error.code === 'ENOTFOUND' || error.response?.status === 429 || axiosRetry.isNetworkOrIdempotentRequestError(error),
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

    // Montar requisição pro PagBank (v2 legada)
    console.log('Montando requisição para PagBank...');
    const params = new URLSearchParams({
      email: email,
      token: process.env.PAGBANK_TOKEN, // Usa o token válido (ex.: da4fdc88-... ou o novo)
      currency: 'BRL',
      itemId1: '1',
      itemDescription1: 'Ebook Recomeços',
      itemAmount1: amount.toFixed(2), // Em reais
      itemQuantity1: '1',
      paymentMethod: paymentMethod.toUpperCase(),
      reference: `PEDIDO_${pedidoId}`,
      notificationURL: 'https://ebook-recomecos-backend.onrender.com/api/notificacao',
    }).toString();

    console.log('Corpo da requisição para PagBank:', params);

    // Enviar requisição pro PagBank
    console.log('Enviando requisição para PagBank...');
    const pagbankResponse = await axiosInstance.post('https://ws.pagseguro.uol.com.br/v2/checkout', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    console.log('Resposta do PagBank:', pagbankResponse.data);

    // Parsear XML da resposta
    const parseString = require('xml2js').parseString;
    let checkoutCode;
    parseString(pagbankResponse.data, (err, result) => {
      if (err) throw err;
      checkoutCode = result.checkout.code[0];
    });

    if (!checkoutCode) {
      console.log('Erro: Código de checkout não encontrado');
      throw new Error('Código de checkout não retornado pelo PagBank');
    }

    const paymentUrl = `https://pagseguro.uol.com.br/v2/checkout/payment.html?code=${checkoutCode}`;

    // Atualizar pedido com pagbank_order_id
    console.log('Atualizando pedido com pagbank_order_id:', checkoutCode);
    await pool.query('UPDATE pedidos SET pagbank_order_id = $1 WHERE id = $2', [checkoutCode, pedidoId]);

    res.json({
      id: pedidoId,
      nome,
      email,
      endereco,
      cpf,
      livro_id: livroId,
      pagbank_order_id: checkoutCode,
      data_pedido: new Date().toISOString(),
      payment_url: paymentUrl,
    });
  } catch (err) {
    console.error('Erro ao criar pedido:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
      headers: err.response?.headers,
    });
    if (err.response?.status === 401) {
      return res.status(500).json({ error: 'Autenticação falhou com o PagBank. Verifique o token.' });
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
    await pool.query('UPDATE pedidos SET status = $1, notified = true WHERE id = $2', [status, pedidoId]);

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
        `,
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
      headers: err.response?.headers,
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