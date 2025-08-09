"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Nav from "../components/Nav";

export default function Checkout() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl = "https://ebook-recomecos-backend.onrender.com/api/pedido";

  /**
   * @typedef {Object} PedidoPayload
   * @property {string} nome
   * @property {string} email
   * @property {string} endereco
   * @property {string} cpf
   * @property {number} livroId
   * @property {number} amount
   * @property {string} paymentMethod
   * @property {string} [cardNumber]
   * @property {string} [cardHolder]
   * @property {string} [expirationDate]
   * @property {string} [cvv]
   */

  /**
   * @typedef {Object} PedidoResponse
   * @property {string} payment_url
   * @property {string} [error]
   */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      nome,
      email,
      endereco,
      cpf,
      livroId: 1,
      amount: 19.90,
      paymentMethod,
    };

    if (paymentMethod === "creditcard") {
      payload.cardNumber = cardNumber;
      payload.cardHolder = cardHolder;
      payload.expirationDate = expirationDate;
      payload.cvv = cvv;
    }

    try {
      console.log("Enviando requisição para:", backendUrl, payload);
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Redirecionando para:", data.payment_url);
        window.location.href = data.payment_url;
      } else {
        setError(data.error || "Erro ao processar o pedido. Tente novamente.");
      }
    } catch (err) {
      console.error("Erro:", err);
      setError("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero">
      {/* Link Início na parte superior */}
      <div className="checkout-top-bar">
        <Link href="/" className="back-button animate-fadeIn">
          Início
        </Link>
      </div>
      <Suspense fallback={<div className="nav animate-pulse">Carregando navegação...</div>}>
        <Nav />
      </Suspense>
      <main className="container main">
        <div className="header-checkout animate-fadeIn">
          <h1 className="hero-title">Finalizar Compra: Recomeços em Tempos de Crise</h1>
        </div>
        <div className="price-container animate-scaleUp">
          <span className="price">R$19,90</span>
          <span className="price-old">R$99,90</span>
        </div>
        <form onSubmit={handleSubmit} className="form animate-slideUp">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome completo"
            className="form-input focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            className="form-input focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            required
          />
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="CPF"
            className="form-input focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            required
          />
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Endereço completo (Rua, Número, Bairro, Cidade, Estado)"
            className="form-input focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            required
          />
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="form-input focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            required
          >
            <option value="pix">Pix</option>
            <option value="creditcard">Cartão de Crédito</option>
            <option value="boleto">Boleto</option>
          </select>
          {paymentMethod === "creditcard" && (
            <>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Número do Cartão"
                className="form-input focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                required
              />
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                placeholder="Nome no Cartão"
                className="form-input focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                required
              />
              <input
                type="text"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                placeholder="Data de Expiração (MM/AAAA)"
                className="form-input focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                required
              />
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="CVV"
                className="form-input focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                required
              />
            </>
          )}
          {error && <p className="form-error text-center animate-fadeIn">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="form-button hover:brightness-110 transition-all duration-300 transform hover:scale-105"
          >
            {loading ? "Processando..." : "Prosseguir para Pagamento"}
          </button>
        </form>
        <div className="pagbank-container animate-fadeIn">
          <img src="/logo_pag.png" alt="PagBank" className="pagbank-logo" />
          <p className="pagbank-text">Pagamento 100% seguro com PagBank</p>
        </div>
      </main>

      {/* Rodapé com Informações de Direitos */}
      <footer className="footer">
        <p className="footer-text">
          © 2025 Recomeços em Tempos de Crise. Todos os direitos reservados.
        </p>
        <p className="footer-text">
          Este site não substitui aconselhamento médico ou pastoral. Consulte um especialista se necessário.
        </p>
      </footer>
    </div>
  );
}