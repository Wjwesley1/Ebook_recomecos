import ImageWithFallback from './components/ImageWithFallback';
import HomeClient from './components/HomeClient';
import { Suspense } from 'react';

async function fetchLivro() {
  try {
    const res = await fetch('http://backend:5000/api/livro', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Erro na requisição: ${res.status}`);
    }
    const data = await res.json();
    return {
      ...data,
      preco: parseFloat(data.preco),
    };
  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    return {
      id: 1,
      titulo: 'Ebook Recomeços',
      preco: 49.90,
      descricao: 'Não foi possível carregar o livro',
      imagem: '/Ebook.png',
    };
  }
}

export default async function Home() {
  const livro = await fetchLivro();

  return (
    <div className="min-h-screen bg-[var(--background)] p-4">
      <header className="p-6 text-center bg-[var(--primary)] text-white rounded-lg mb-6">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">{livro.titulo}</h1>
        <p className="text-lg sm:text-xl mb-6">{livro.descricao}</p>
      </header>
      <main className="flex flex-col items-center p-4 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <ImageWithFallback
            src={livro.imagem}
            alt="Capa do Ebook Recomeços"
            className="w-64 h-auto rounded shadow-lg"
          />
          <div className="text-center sm:text-left">
            <p className="text-2xl font-semibold mb-4 text-[var(--foreground)]">
              Apenas R${livro.preco.toFixed(2)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/checkout"
                className="bg-[var(--accent)] text-black px-8 py-3 rounded-lg hover:bg-yellow-600 transition"
              >
                Comprar Agora
              </a>
              <a
                href="http://backend:5000/api/amostra"
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                download
              >
                Baixar Amostra
              </a>
            </div>
          </div>
        </div>
        <Suspense fallback={<div>Carregando testemunhos...</div>}>
          <HomeClient />
        </Suspense>
      </main>
    </div>
  );
}