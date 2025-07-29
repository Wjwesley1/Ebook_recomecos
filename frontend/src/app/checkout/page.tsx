'use client';

import { useState } from 'react';

export default function Checkout() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [endereco, setEndereco] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const backendUrl = 'https://ebook-recomecos-backend.onrender.com/api/pedido';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Enviando requisição para:', backendUrl);
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          endereco,
          cpf,
          livroId: 1,
          amount: 19.90,
          paymentMethod
        }),
      });

      const data = await response.json();
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
    <div className="bg-indigo-50 min-h-screen bg-gradient-to-br from-indigo-500 to-emerald-500">
      <nav className="bg-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-emerald-500">Recomeços</h1>
          <div className="space-x-4">
            <a href="#sobre" className="text-indigo-500">Sobre o E-book</a>
            <a href="#para-quem" className="text-indigo-500">Para Quem</a>
            <a href="#autor" className="text-indigo-500">Autor</a>
            <a href="#depoimentos" className="text-indigo-500">Depoimentos</a>
            <a href="/" className="text-white bg-indigo-500 px-4 py-2 rounded">Voltar à Home</a>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-6">
          Finalizar Compra: Recomeços em Tempos de Crise
        </h1>
        <div className="flex items-center justify-between mb-6">
          <span className="text-2xl text-white bg-gradient-to-r from-indigo-500 to-emerald-500 p-2 rounded">
            R$19,90
          </span>
          <span className="text-gray-500 line-through">R$99,90</span>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome completo"
            className="text-gray-700 mb-4 p-2 border rounded w-full"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            className="text-gray-700 mb-4 p-2 border rounded w-full"
            required
          />
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="CPF"
            className="text-gray-700 mb-4 p-2 border rounded w-full"
            required
          />
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Endereço completo (Rua, Número, Bairro, Cidade, Estado)"
            className="text-gray-700 mb-4 p-2 border rounded w-full"
            required
          />
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="text-gray-700 mb-4 p-2 border rounded w-full"
            required
          >
            <option value="pix">Pix</option>
            <option value="creditcard">Cartão de Crédito</option>
            <option value="boleto">Boleto</option>
          </select>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-indigo-500 to-emerald-500 text-white p-2 rounded w-full"
          >
            {loading ? 'Processando...' : 'Prosseguir para Pagamento'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <img src="/pagbank-logo.png" alt="PagBank" className="inline-block h-8 w-auto" />
          <p className="text-gray-700">Pagamento 100% seguro com PagBank</p>
        </div>
      </main>
    </div>
  );
}