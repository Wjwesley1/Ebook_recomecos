'use client';

import { useEffect, useState } from 'react';

export default function HomeClient() {
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSucesso(params.get('sucesso') === '1');
  }, []);

  const testemunhos = [
    { texto: "Uma leitura transformadora que me inspirou a dar o próximo passo!", autor: "Maria S." },
    { texto: "Um guia incrível para recomeçar com confiança!", autor: "João P." },
  ];

  return (
    <div className="testimonial-section">
      {sucesso && (
        <div className="success-message">
          Pagamento realizado com sucesso! Verifique seu e-mail para mais detalhes.
        </div>
      )}
      <section>
        <h2 className="testimonial-title">Depoimentos</h2>
        {testemunhos.map((testemunho, index) => (
          <div key={index} className="testimonial">
            <p className="testimonial-text">&quot;{testemunho.texto}&quot;</p>
            <p className="testimonial-author">— {testemunho.autor}</p>
          </div>
        ))}
      </section>
    </div>
  );
}