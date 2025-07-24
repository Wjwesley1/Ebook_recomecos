'use client';

import { useState } from 'react';

export default function Checkout() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cpf, setCpf] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const backendUrl = 'https://ebook-recomecos-backend.onrender.com/api/pedido';

  // Função pra validar CPF
  const validarCPF = (cpf: string) => {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    let sum = 0;
    let rest;
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf[i - 1]) * (11 - i);
    }
    rest = (sum * 10) % 11;
    if (rest >= 10) rest = 0;
    if (rest !== parseInt(cpf[9])) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf[i - 1]) * (12 - i);
    }
    rest = (sum * 10) % 11;
    if (rest >= 10) rest = 0;
    if (rest !== parseInt(cpf[10])) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validação do CPF
    if (!validarCPF(cpf)) {
      setError('CPF inválido. Por favor, verifique.');
      setLoading(false);
      return;
    }

    try {
      console.log('Valor de NEXT_PUBLIC_BACKEND_URL:', process.env.NEXT_PUBLIC_BACKEND_URL);
      const backendUrl = 'https://ebook-recomecos-backend.onrender.com/api/pedido'; // Ajuste pra URL do Render
      // const backendUrl = 'http://localhost:5000/api/pedido'; // Use isso pra testes locais

      console.log('Enviando requisição para:', backendUrl);
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          endereco,
          cpf: cpf.replace(/\D/g, ''),
          livroId: 1,
          amount: 19.90,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar pedido');
      }

      console.log('Redirecionando para:', data.payment_url);
      setSuccess('Formulário enviado! Redirecionando para o pagamento...');
      window.location.href = data.payment_url;
    } catch (err: any) {
      console.error('Erro ao enviar formulário:', err.message);
      setError('Erro ao processar o pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <span className="text-emerald-500">Recome</span>
            <span className="text-indigo-500">ços</span>
          </h1>
          <div className="space-x-4">
            <a href="#sobre" className="text-gray-600 hover:text-indigo-500">Sobre o E-book</a>
            <a href="#para-quem" className="text-gray-600 hover:text-indigo-500">Para Quem</a>
            <a href="#autor" className="text-gray-600 hover:text-indigo-500">Autor</a>
            <a href="#depoimentos" className="text-gray-600 hover:text-indigo-500">Depoimentos</a>
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-indigo-500 to-emerald-500 text-white px-4 py-2 rounded-md"
            >
              Voltar à Home
            </a>
          </div>
        </div>
      </nav>

      {/* Seção principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="hero-gradient rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Finalizar Compra: Recomeços em Tempos de Crise
          </h2>
          <p className="text-gray-500 line-through text-xl mb-2">De R$99,90</p>
          <p className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-emerald-500 text-transparent bg-clip-text">
            Por apenas R$19,90
          </p>
        </div>

        {/* Formulário */}
        <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="nome">
                Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="cpf">
                CPF
              </label>
              <input
                type="text"
                id="cpf"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="123.456.789-09"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="endereco">
                Endereço Completo
              </label>
              <input
                type="text"
                id="endereco"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Rua, Número, Bairro, Cidade, Estado"
                required
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-md text-white font-semibold bg-gradient-to-r from-indigo-500 to-emerald-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              }`}
            >
              {loading ? 'Processando...' : 'Prosseguir para Pagamento'}
            </button>
          </form>
          <div className="mt-4 flex justify-center items-center">
            <img src="/pagbank-logo.png" alt="PagBank" className="h-8 mr-2" />
            <p className="text-gray-600">Pagamento 100% seguro com PagBank</p>
          </div>
        </div>
      </div>
    </div>
  );
}