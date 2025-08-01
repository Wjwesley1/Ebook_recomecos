import { Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import HomeClient from './components/HomeClient';
import Nav from './components/Nav';

export default function Home() {
  const location = useLocation();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Verifica se o usuário veio de /sucesso ou ?sucesso=1
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('sucesso') === '1' || location.state?.fromSuccess) {
      setShowSuccessMessage(true);
      // Remove a mensagem após 5 segundos
      const timer = setTimeout(() => setShowSuccessMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className="hero">
      <Nav />
      <main className="container main">
        {showSuccessMessage && (
          <div className="success-message">
            Pagamento confirmado! O e-book será enviado para o seu e-mail em breve.
          </div>
        )}
        <h1 className="hero-title">Recomeços em Tempos de Crise</h1>
        <p className="hero-text">Um guia transformador para superar desafios e recomeçar com confiança!</p>
        <div className="price-container">
          <span className="price">R$19,90</span>
          <span className="price-old">R$99,90</span>
        </div>
        <a href="/checkout" className="button" aria-label="Adquirir o E-book Recomeços agora">
          Adquirir Agora
        </a>
        <Suspense fallback={<div className="hero-text mt-6">Carregando depoimentos...</div>}>
          <HomeClient />
        </Suspense>
      </main>
    </div>
  );
}