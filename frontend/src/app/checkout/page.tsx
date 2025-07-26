'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Checkout() {
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    endereco: '',
    paymentMethod: 'creditCard', // Opções: creditCard, pix, boleto
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validação de CPF (11 dígitos)
    if (!/^\d{11}$/.test(formData.cpf)) {
      setError('CPF inválido. Deve conter 11 dígitos.');
      setLoading(false);
      return;
    }

    // Validação de Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Email inválido.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://ebook-recomecos-backend.onrender.com/api/pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          livroId: 1,
          amount: 19.90,
          currency: 'BRL',
        }),
      });

      if (response.ok) {
        const { payment_url } = await response.json();
        setSuccess('Redirecionando para o PagBank...');
        setTimeout(() => {
          window.location.href = payment_url; // Redireciona pro PagBank
        }, 1000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao processar o pedido. Tente novamente.');
        setLoading(false);
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <Link href="/" className="navbar-logo">
          Ebook Recomeços
        </Link>
      </nav>

      {/* Conteúdo Principal */}
      <div className="container">
        <h1>Checkout</h1>
        <div className="price-container">
          <span className="price">R$19,90</span>
          <span className="price-old">R$99,90</span>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <label>
            Nome:
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className="input"
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input"
              required
            />
          </label>
          <label>
            CPF:
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleInputChange}
              className="input"
              required
            />
          </label>
          <label>
            Endereço:
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleInputChange}
              className="input"
              required
            />
          </label>
          <label>
            Método de Pagamento:
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="input"
            >
              <option value="creditCard">Cartão de Crédito</option>
              <option value="pix">Pix</option>
              <option value="boleto">Boleto</option>
            </select>
          </label>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Processando...' : 'Prosseguir para Pagamento'}
          </button>
        </form>

        {isClient && (
          <div className="footer">
            <img src="/pagbank-logo.png" alt="PagBank" />
            <p>Pagamento 100% seguro com PagBank</p>
          </div>
        )}
      </div>
    </div>
  );
}