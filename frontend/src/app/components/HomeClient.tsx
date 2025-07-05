'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function HomeClient() {
  const searchParams = useSearchParams();
  const sucesso = searchParams.get('sucesso') === '1';
  const testemunhos = [
    { texto: "Uma leitura transformadora que me inspirou a dar o próximo passo!", autor: "Maria S." },
    { texto: "Um guia incrível para recomeçar com confiança!", autor: "João P." },
    { texto: "Recomendo para quem busca motivação e clareza!", autor: "Ana L." },
  ];
  const [currentTestemunho, setCurrentTestemunho] = useState(0);

  return (
    <>
      {sucesso && (
        <p className="text-green-600 font-semibold mb-4 text-center">Pedido enviado com sucesso!</p>
      )}
      <section className="my-8 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">
          O que dizem sobre o Ebook Recomeços
        </h2>
        <div className="relative">
          <div className="transition-opacity duration-700 ease-in-out" key={currentTestemunho}>
            <p className="text-lg italic text-[var(--foreground)] mb-4">
              "{testemunhos[currentTestemunho].texto}" - {testemunhos[currentTestemunho].autor}
            </p>
          </div>
          <div className="flex justify-center gap-2 mb-4">
            {testemunhos.map((_, index) => (
              <span
                key={index}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  index === currentTestemunho ? 'bg-[var(--primary)]' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentTestemunho(index)}
              />
            ))}
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setCurrentTestemunho((prev) => (prev > 0 ? prev - 1 : testemunhos.length - 1))}
              className="bg-[var(--primary)] text-white px-3 py-1 rounded hover:bg-indigo-800"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentTestemunho((prev) => (prev < testemunhos.length - 1 ? prev + 1 : 0))}
              className="bg-[var(--primary)] text-white px-3 py-1 rounded hover:bg-indigo-800"
            >
              Próximo
            </button>
          </div>
        </div>
      </section>
    </>
  );
}