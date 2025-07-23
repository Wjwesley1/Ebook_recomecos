const express = require('express');
const { Pool } = require('pg');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configurar CORS pra aceitar requisições do frontend (local ou Render)
app.use(cors({
  origin: ['http://localhost:3000', 'https://ebook-recomecos-frontend.onrender.com'], // Ajuste a URL do frontend após deploy
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Configurar conexão com o banco PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Endpoint de saúde pra verificar se o servidor tá rodando
app.get('/api/health', (req, res) => {
  console.log('Requisição recebida em /api/health');
  res.json({ status: 'OK' });
});

// Endpoint pra criar pedido e integrar com PagBank
app.post('/api/pedido', async (req, res) => {
  const { nome, email, endereco, cpf, livroId, amount } = req.body;

  try {
    console.log('Dados recebidos em /api/pedido:', { nome, email, endereco, cpf, livroId, amount });

    // Validação dos campos obrigatórios
    if (!nome || !email || !endereco || !cpf || !livroId || !amount) {
      console.log('Erro: Campos obrigatórios faltando');
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
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

    // Enviar requisição pro PagBank
    console.log('Enviando requisição para PagBank...');
    const pagbankResponse = await axios.post(
      'https://sandbox.api.pagseguro.com/orders',
      {
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
            postal_code: '01452002',
          },
        },
        items: [
          {
            name: 'Ebook Recomeços',
            unit_amount: Math.round(amount * 100), // Converte R$19,90 pra 1990 centavos
            quantity: 1,
          },
        ],
        payment_methods: [
          { type: 'CREDIT_CARD', installments: { max_number: 12 } },
          { type: 'BOLETO' },
          { type: 'PIX' },
        ],
        redirect_url: 'http://localhost:3000', // Ajuste pra URL do frontend após deploy
        notification_urls: ['https://SEU_NGROK_OU_RENDER_URL/api/notificacao'], // Ex.: https://abc123.ngrok.io ou https://ebook-recomecos-backend.onrender.com
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAGBANK_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

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

    // Retornar resposta com o payment_url
    res.json({
      id: pedidoId,
      nome,
      email,
      endereco,
      cpf,
      livro_id: livroId,
      pagbank_order_id: pagbankOrderId,
      data_pedido: new Date().toISOString(),
      payment_url: paymentUrl,
    });
  } catch (err) {
    console.error('Erro ao criar pedido:', err.response?.data || err.message);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

// Endpoint pra receber notificações do PagBank
app.post('/api/notificacao', async (req, res) => {
  const { notificationCode } = req.body;
  try {
    console.log('Notificação recebida:', notificationCode);
    const response = await axios.get(
      `https://sandbox.api.pagseguro.com/notifications/${notificationCode}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAGBANK_TOKEN}` },
      }
    );
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

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection error:', err.message);
  }
  console.log(`Server running on port ${PORT}`);
});