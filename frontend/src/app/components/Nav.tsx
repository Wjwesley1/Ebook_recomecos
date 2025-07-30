'use client';

import { useState, useEffect } from 'react';

export default function Nav() {
  const [isCheckout, setIsCheckout] = useState(false);

  useEffect(() => {
    setIsCheckout(window.location.pathname === '/checkout');
  }, []);

  return (
    <nav className="nav">
      <div className="nav-content">
        <h1 className="nav-logo">Recomeços</h1>
        <div className="nav-links">
          <a href="#sobre">Sobre o E-book</a>
          <a href="#para-quem">Para Quem</a>
          <a href="#autor">Autor</a>
          <a href="#depoimentos">Depoimentos</a>
          <a href={isCheckout ? '/' : '/checkout'} className="button">
            {isCheckout ? 'Voltar à Home' : 'Comprar Agora'}
          </a>
        </div>
      </div>
    </nav>
  );
}