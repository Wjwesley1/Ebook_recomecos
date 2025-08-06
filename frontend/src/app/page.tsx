import { Suspense } from 'react';
import Link from 'next/link';
import HomeClient from './components/HomeClient';
import Nav from './components/Nav';
import SuccessMessage from './components/SuccessMessage';
import ImageWithFallback from './components/ImageWithFallback';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-emerald-500">
      <Suspense fallback={<nav className="bg-white p-4 shadow-md"><div>Carregando navegação...</div></nav>}>
        <Nav />
      </Suspense>
      <main className="container mx-auto p-6">
        <Suspense fallback={<div className="bg-green-100 text-green-800 p-4 rounded">Carregando mensagem...</div>}>
          <SuccessMessage />
        </Suspense>
        <h1 className="text-4xl font-bold text-white mb-4">Recomeços em Tempos de Crise</h1>
        <p className="text-white mb-6">Um guia transformador para superar desafios e recomeçar com confiança!</p>
        <div className="flex items-center gap-4 mb-6">
          <span className="text-2xl text-white bg-gradient-to-r from-indigo-500 to-emerald-500 p-2 rounded">R$19,90</span>
          <span className="text-lg text-gray-500 line-through">R$29,90</span>
        </div>
        <Link href="/checkout" className="bg-gradient-to-r from-indigo-500 to-emerald-500 text-white px-6 py-3 rounded hover:from-indigo-600 hover:to-emerald-600" aria-label="Adquirir o E-book Recomeços agora">
          Adquirir Agora
        </Link>

        <section className="mt-12 bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Para Quem é Este E-book?</h2>
          <p className="text-gray-700 mb-4">
            Este e-book é ideal para quem enfrenta momentos de crise e busca inspiração e ferramentas práticas para recomeçar...
          </p>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Pessoas em busca de motivação para superar obstáculos.</li>
            <li>Profissionais que desejam reinventar sua trajetória.</li>
            <li>Qualquer um que queira desenvolver resiliência e confiança.</li>
          </ul>
        </section>

        <section className="mt-12 bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sobre o Autor</h2>
          <p className="text-gray-700">
            [Nome do Autor] é um especialista em desenvolvimento pessoal e resiliência...
          </p>
          <Suspense fallback={<div className="bg-green-100 text-green-800 p-4 rounded mt-4">Carregando imagem...</div>}>
            <ImageWithFallback src="/author.jpg" alt="Foto do Autor" className="mt-4 w-64 h-auto rounded" />
          </Suspense>
        </section>

        <Suspense fallback={<div className="bg-green-100 text-green-800 p-4 rounded mt-24">Carregando depoimentos...</div>}>
          <HomeClient />
        </Suspense>
      </main>
    </div>
  );
}