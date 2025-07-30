'use client';

import { useState, Suspense } from 'react';
import Nav from '../components/Nav';

export default function Checkout() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [endereco, setEndereco] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const backendUrl = 'https://ebook-recomecos-backend.onrender.com/api/pedido';

  interface PedidoRequest {
    nome: string;
    email: string;
    endereco: string;
    cpf: string;
    livroId: number;
    amount: number;
    paymentMethod: string;
  }

  interface PedidoResponse {
    payment_url: string;
    error?: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Enviando requisição para:', backendUrl);
      const requestBody: PedidoRequest = {
        nome,
        email,
        endereco,
        cpf,
        livroId: 1,
        amount: 19.90,
        paymentMethod
      };
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data: PedidoResponse = await response.json();
      if (response.ok) {
        console.log('Redirecionando para:', data.payment_url);
        window.location.href = data.payment_url;
      } else {
        setError(data.error || 'Erro ao processar o pedido. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro:', err);
      setError('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero">
      <Suspense fallback={<div className="nav">Carregando navegação...</div>}>
        <Nav />
      </Suspense>
      <main className="container main">
        <h1 className="hero-title">Finalizar Compra: Recomeços em Tempos de Crise</h1>
        <div className="price-container">
          <span className="price">R$19,90</span>
          <span className="price-old">R$99,90</span>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome completo"
            className="form-input"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            className="form-input"
            required
          />
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="CPF"
            className="form-input"
            required
          />
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Endereço completo (Rua, Número, Bairro, Cidade, Estado)"
            className="form-input"
            required
          />
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="form-input"
            required
          >
            <option value="pix">Pix</option>
            <option value="creditcard">Cartão de Crédito</option>
            <option value="boleto">Boleto</option>
          </select>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" disabled={loading} className="form-button">
            {loading ? 'Processando...' : 'Prosseguir para Pagamento'}
          </button>
        </form>
        <div className="pagbank-container">
          <img src="/pagbank-logo.png" alt="PagBank" className="pagbank-logo" />
          <p className="pagbank-text">Pagamento 100% seguro com PagBank</p>
        </div>
      </main>
    </div>
  );
}