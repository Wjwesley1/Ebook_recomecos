'use client';

import { useState, useEffect } from 'react';

interface Pedido {
  id: number;
  cliente_nome: string;
  cliente_email: string;
  endereco: string;
  livro_id: number;
  status: string;
  created_at: string;
}

export default function Pedidos() {
  const [senha, setSenha] = useState('');
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    try {
      const res = await fetch(`http://backend:5000/api/pedidos?senha=${senha}`);
      if (!res.ok) {
        throw new Error('Erro ao buscar pedidos');
      }
      const data = await res.json();
      setPedidos(data);
    } catch (error) {
      setErro('Acesso não autorizado ou erro no servidor');
      setPedidos([]);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6 text-center">Lista de Pedidos</h1>
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex justify-center space-x-4">
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite a senha"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-900 text-white px-6 py-3 rounded-lg hover:bg-indigo-800 transition"
              disabled={carregando}
            >
              {carregando ? 'Carregando...' : 'Acessar Pedidos'}
            </button>
          </div>
        </form>
        {erro && <p className="text-red-500 text-center mb-4">{erro}</p>}
        {pedidos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
              <thead>
                <tr className="bg-indigo-900 text-white">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Nome</th>
                  <th className="p-3 text-left">E-mail</th>
                  <th className="p-3 text-left">Endereço</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Data</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="border-b">
                    <td className="p-3">{pedido.id}</td>
                    <td className="p-3">{pedido.cliente_nome}</td>
                    <td className="p-3">{pedido.cliente_email}</td>
                    <td className="p-3">{pedido.endereco}</td>
                    <td className="p-3">{pedido.status}</td>
                    <td className="p-3">{new Date(pedido.created_at).toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600">Nenhum pedido encontrado.</p>
        )}
      </div>
    </div>
  );
}
