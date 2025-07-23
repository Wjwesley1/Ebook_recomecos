'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Checkout() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    endereco: '',
    cpf: ''
  });
  const [error, setError] = useState('');
  const backendUrl = 'http://localhost:5000/api/pedido';

  const validateCPF = (cpf: string) => {
    // Função de validação de CPF
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
    let mod = sum % 11;
    let digit = mod < 2 ? 0 : 11 - mod;
    if (parseInt(cpf[9]) !== digit) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
    mod = sum % 11;
    digit = mod < 2 ? 0 : 11 - mod;
    return parseInt(cpf[10]) === digit;
  };

  interface FormData {
    nome: string;
    email: string;
    endereco: string;
    cpf: string;
  }

  interface PedidoResponse {
    payment_url: string;
    error?: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateCPF(formData.cpf)) {
      setError('CPF inválido. Por favor, verifique.');
      return;
    }
    setError('');
    try {
      console.log('Enviando requisição para:', backendUrl);
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          livroId: 1,
          amount: 19.90
        })
      });
      const data: PedidoResponse = await response.json();
      if (response.ok) {
        console.log('Redirecionando para:', data.payment_url);
        window.location.href = data.payment_url;
      } else {
        setError(data.error || 'Erro ao processar o pedido');
      }
    } catch (err) {
      console.error('Erro:', err);
      setError('Erro ao conectar com o servidor');
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 py-10">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <h1 className="text-2xl font-bold text-indigo-500">Recomeços</h1>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-700 hover:text-indigo-500">Sobre o E-book</a>
              <a href="#" className="text-gray-700 hover:text-indigo-500">Para Quem</a>
              <a href="#" className="text-gray-700 hover:text-indigo-500">Autor</a>
              <a href="#" className="text-gray-700 hover:text-indigo-500">Depoimentos</a>
              <Link href="/" className="text-gray-700 hover:text-indigo-500">Voltar à Home</Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg bg-gradient-to-r from-indigo-500 to-emerald-500">
        <h2 className="text-3xl font-bold text-white mb-6">Finalizar Compra: Recomeços em Tempos de Crise</h2>
        <div className="mb-4">
          <span className="text-2xl font-bold text-white bg-gradient-to-r from-indigo-500 to-emerald-500 px-2 py-1 rounded">R$19,90</span>
          <span className="text-gray-500 line-through ml-2">R$99,90</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Nome</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">E-mail</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">CPF</label>
            <input
              type="text"
              value={formData.cpf}
              onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Endereço</label>
            <input
              type="text"
              value={formData.endereco}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-emerald-500 text-white rounded hover:bg-indigo-600"
          >
            Prosseguir para Pagamento
          </button>
        </form>
        <div className="mt-4 text-center">
          <img src="/pagbank-logo.png" alt="PagBank" className="inline-block h-8" />
          <p className="text-gray-600">Pagamento 100% seguro com PagBank</p>
        </div>
      </div>
    </div>
  );
}