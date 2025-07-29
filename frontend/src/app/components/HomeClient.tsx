'use client';

import { useSearchParams } from 'next/navigation';

export default function HomeClient() {
  const searchParams = useSearchParams();
  const sucesso = searchParams ? searchParams.get('sucesso') === '1' : false;

  const testemunhos = [
    { texto: "Uma leitura transformadora que me inspirou a dar o próximo passo!", autor: "Maria S." },
    { texto: "Um guia incrível para recomeçar com confiança!", autor: "João P." },
  ];

  return (
    <div>
      {sucesso && (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-6">
          Pagamento realizado com sucesso! Verifique seu e-mail para mais detalhes.
        </div>
      )}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Depoimentos</h2>
        {testemunhos.map((testemunho, index) => (
          <div key={index} className="mb-4">
            <p className="text-gray-700">&quot;{testemunho.texto}&quot;</p>
            <p className="text-gray-500 font-semibold">— {testemunho.autor}</p>
          </div>
        ))}
      </section>
    </div>
  );
}