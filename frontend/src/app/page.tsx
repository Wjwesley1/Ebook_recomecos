const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());

// Configuração de CORS
app.use(cors({
  origin: ['http://localhost:3000', 'https://ebook-recomecos-frontend.onrender.com'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Responde ao preflight (OPTIONS)
app.options('*', cors());

// Endpoint de health check
app.get('/api/health', (req: import('express').Request, res: import('express').Response) => {
  res.json({ status: 'OK' });
});

// Endpoint de pedido
interface PedidoRequestBody {
  nome: string;
  email: string;
  endereco: string;
  cpf: string;
  livroId: number;
  amount: number;
}

interface PedidoResponseBody {
  id: number;
  nome: string;
  email: string;
  endereco: string;
  cpf: string;
  livro_id: number;
  pagbank_order_id: string;
  data_pedido: string;
  payment_url: string;
}

import type { Request, Response } from 'express';

interface PedidoRequest extends Request<unknown, unknown, PedidoRequestBody> {}
interface PedidoResponse extends Response<PedidoResponseBody> {}

app.post(
  '/api/pedido',
  async (
    req: PedidoRequest,
    res: PedidoResponse
  ) => {
    const { nome, email, endereco, cpf, livroId, amount } = req.body;
    // Simulação de integração com PagBank
    const payment_url = `https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code=FAKE_CODE_${Date.now()}`;
    res.json({
      id: 1,
      nome,
      email,
      endereco,
      cpf,
      livro_id: livroId,
      pagbank_order_id: `CHK-${Date.now()}`,
      data_pedido: new Date().toISOString(),
      payment_url
    });
  }
);

interface NotificacaoRequest extends Request {}
interface NotificacaoResponse extends Response {}

app.post('/api/notificacao', (req: NotificacaoRequest, res: NotificacaoResponse) => {
  console.log('Notificação recebida:', req.body);
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});