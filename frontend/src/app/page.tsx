import { Suspense } from 'react';
import HomeClient from './components/HomeClient';
import Nav from './components/Nav';

export default function Home() {
  return (
    <div className="hero">
      <Nav />
      <main className="container main">
        <h1 className="hero-title">Recomeços em Tempos de Crise</h1>
        <p className="hero-text">Um guia transformador para superar desafios e recomeçar com confiança!</p>
        <div className="price-container">
          <span className="price">R$19,90</span>
          <span className="price-old">R$99,90</span>
        </div>
        <a href="/checkout" className="button">Adquirir Agora</a>
        <Suspense fallback={<div className="hero-text mt-6">Carregando depoimentos...</div>}>
          <HomeClient />
        </Suspense>
      </main>
    </div>
  );
}