'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
        <h1>Ebook Recomeços</h1>
        <p>
          Bem-vindo ao <span>Ebook Recomeços em Tempos de Crise</span>! 
          Descubra estratégias práticas para superar desafios e recomeçar com confiança.
        </p>
        <div className="price-container">
          <span className="price">R$19,90</span>
          <span className="price-old">R$99,90</span>
        </div>
        <Link href="/checkout" className="button">
          Comprar Agora
        </Link>
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