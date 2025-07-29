'use client';

import HomeClient from './components/HomeClient';

export default function Home() {
  return (
    <div className="bg-indigo-50 min-h-screen bg-gradient-to-br from-indigo-500 to-emerald-500">
      <nav className="bg-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-emerald-500">Recomeços</h1>
          <div className="space-x-4">
            <a href="#sobre" className="text-indigo-500">Sobre o E-book</a>
            <a href="#para-quem" className="text-indigo-500">Para Quem</a>
            <a href="#autor" className="text-indigo-500">Autor</a>
            <a href="#depoimentos" className="text-indigo-500">Depoimentos</a>
            <a href="/checkout" className="text-white bg-indigo-500 px-4 py-2 rounded">Comprar Agora</a>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-white mb-6">Recomeços em Tempos de Crise</h1>
        <p className="text-white text-lg mb-6">Um guia transformador para superar desafios e recomeçar com confiança!</p>
        <div className="flex items-center justify-between mb-6">
          <span className="text-2xl text-white bg-gradient-to-r from-indigo-500 to-emerald-500 p-2 rounded">
            R$19,90
          </span>
          <span className="text-gray-500 line-through">R$99,90</span>
        </div>
        <a
          href="/checkout"
          className="bg-gradient-to-r from-indigo-500 to-emerald-500 text-white p-3 rounded inline-block"
        >
          Adquirir Agora
        </a>
        <HomeClient />
      </main>
    </div>
  );
}