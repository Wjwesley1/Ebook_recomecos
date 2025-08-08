"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Checkout() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [endereco, setEndereco] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      paymentMethod,
      amount: 19.90,
      buyer: {
        name: nome,
        email,
        taxId: cpf,
        address: {
          street: endereco.split(',')[0] || 'Rua Exemplo',
          number: endereco.split(',')[1] || '123',
          complement: '',
          district: endereco.split(',')[2] || 'Bairro Exemplo',
          city: endereco.split(',')[3] || 'Cidade Exemplo',
          state: endereco.split(',')[4] || 'SP',
          country: 'BRA',
          postalCode: '12345-678',
        },
      },
      ...(paymentMethod === 'creditcard' && {
        card: {
          number: cardNumber,
          holder: cardHolder,
          expirationDate,
          securityCode: cvv,
        },
      }),
    };

    try {
      const response = await fetch('https://api-sandbox.pagseguro.com/charges', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PAGBANK_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reference_id: `REF-${Date.now()}`,
          description: 'Compra do e-book Recomeços',
          amount: {
            value: (payload.amount * 100).toFixed(0),
            currency: 'BRL',
          },
          payment_method: {
            type: paymentMethod === 'creditcard' ? 'CREDIT_CARD' : paymentMethod.toUpperCase(),
            ...(paymentMethod === 'creditcard' && {
              installments: 1,
              card: payload.card,
            }),
          },
          notification_urls: ['https://ebook-recomecos-frontend.onrender.com/webhook'],
          buyer: payload.buyer,
        }),
      });

      const data = await response.json();
      if (response.ok && data.charge) {
        window.location.href = data.charge.payment_response.payment_url;
      } else {
        setError(data.error || 'Erro ao criar o pagamento. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro:', err);
      setError('Erro ao conectar com o PagBank. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="gradient-bg text-white py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">✨ Recomeços em Tempos de Crise</h1>
          <Link href="/" className="text-white hover:text-gray-200">
            Voltar
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-20 max-w-7xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Finalizar Compra</h1>
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl">
          <div className="mb-6 text-center">
            <p className="text-3xl font-bold text-green-600">R$ 19,90</p>
            <p className="text-gray-600">E-book Recomeços em Tempos de Crise</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nome" className="block text-gray-700 font-bold mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo"
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="cpf" className="block text-gray-700 font-bold mb-2">
                CPF
              </label>
              <input
                type="text"
                id="cpf"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="CPF"
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="endereco" className="block text-gray-700 font-bold mb-2">
                Endereço completo
              </label>
              <input
                type="text"
                id="endereco"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Rua, Número, Bairro, Cidade, Estado"
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="paymentMethod" className="block text-gray-700 font-bold mb-2">
                Método de Pagamento
              </label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              >
                <option value="pix">Pix</option>
                <option value="creditcard">Cartão de Crédito</option>
                <option value="boleto">Boleto</option>
              </select>
            </div>
            {paymentMethod === 'creditcard' && (
              <>
                <div>
                  <label htmlFor="cardNumber" className="block text-gray-700 font-bold mb-2">
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Número do Cartão"
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cardHolder" className="block text-gray-700 font-bold mb-2">
                    Nome no Cartão
                  </label>
                  <input
                    type="text"
                    id="cardHolder"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Nome no Cartão"
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label htmlFor="expirationDate" className="block text-gray-700 font-bold mb-2">
                      Data de Expiração (MM/AAAA)
                    </label>
                    <input
                      type="text"
                      id="expirationDate"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                      placeholder="MM/AAAA"
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="cvv" className="block text-gray-700 font-bold mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="CVV"
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                  </div>
                </div>
              </>
            )}
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              {loading ? 'Processando...' : 'Prosseguir para Pagamento'}
            </button>
          </form>
          <div className="text-center mt-4 text-gray-500">
            <span className="mr-2">🔒</span> Pagamento 100% seguro com PagBank
          </div>
        </div>
      </main>
    </div>
  );
}