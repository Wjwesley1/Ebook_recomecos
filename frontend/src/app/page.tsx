"use client";

import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-gray-50">
      {/* Header */}
      <header className="gradient-bg text-white py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">✨ Recomeços em Tempos de Crise</h1>
          <button
            onClick={() => document.getElementById('offer')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Comprar Agora
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="container mx-auto px-4 text-center max-w-7xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Transforme Sua Vida em{' '}
              <span className="text-yellow-300">30 Dias</span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Um guia transformador para superar desafios e recomeçar com confiança!
            </p>
            <div className="float-animation inline-block mb-8">
              <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm mx-auto">
                <div className="bg-gradient-to-br from-indigo-500 to-emerald-500 h-64 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-2">📖</div>
                    <h3 className="text-xl font-bold">RECOMEÇOS</h3>
                    <h3 className="text-xl font-bold">EM TEMPOS DE CRISE</h3>
                    <p className="text-sm mt-2 opacity-80">Guia Completo</p>
                  </div>
                </div>
                <div className="text-gray-800">
                  <p className="font-semibold">150+ páginas de conteúdo</p>
                  <p className="text-sm text-gray-600">Exercícios práticos inclusos</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/checkout"
                className="pulse-animation bg-yellow-400 text-gray-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-yellow-300 transition-colors"
              >
                🚀 Quero Transformar Minha Vida
              </Link>
              <p className="text-sm opacity-75">⭐ Garantia de 30 dias ou seu dinheiro de volta</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">
            O Que Você Vai Descobrir
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-hover bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Supere Crises</h3>
              <p className="text-gray-600">Estratégias pra enfrentar desafios com resiliência</p>
            </div>
            <div className="card-hover bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl text-center">
              <div className="text-5xl mb-4">💪</div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Recomece com Força</h3>
              <p className="text-gray-600">Ferramentas práticas pra reconstruir sua vida</p>
            </div>
            <div className="card-hover bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl text-center">
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Mentalidade Positiva</h3>
              <p className="text-gray-600">Técnicas pra manter o foco e a motivação</p>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Veja o Que Nossos Leitores Dizem
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold">Maria Silva</h4>
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-gray-600">"Este livro me ajudou a superar uma fase difícil. Recomendo!"</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  J
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold">João Santos</h4>
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-gray-600">"Mudou minha forma de ver as crises. Excelente!"</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold">Ana Costa</h4>
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-gray-600">"Prático e inspirador. Minha vida mudou!"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Oferta */}
      <section id="offer" className="py-20 gradient-bg text-white">
        <div className="container mx-auto px-4 text-center max-w-7xl">
          <h2 className="text-4xl font-bold mb-8">Oferta Especial - Apenas Hoje!</h2>
          <div className="max-w-2xl mx-auto bg-white text-gray-800 rounded-2xl p-8 shadow-2xl">
            <div className="mb-6">
              <p className="text-sm text-gray-500 line-through">De R$ 29,90</p>
              <p className="text-5xl font-bold text-green-600 mb-2">R$ 19,90</p>
              <p className="text-sm text-gray-600">Pagamento único - Acesso imediato</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <h3 className="font-bold mb-4">Você recebe:</h3>
              <ul className="text-left space-y-2">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> E-book completo (150+ páginas)
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Exercícios práticos
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Garantia de 30 dias
                </li>
              </ul>
            </div>
            <Link
              href="/checkout"
              className="w-full bg-green-500 text-white py-4 rounded-xl text-xl font-bold hover:bg-green-600 transition-colors mb-4 block"
            >
              🔒 Comprar Agora - R$ 19,90
            </Link>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <span className="mr-2">🔒</span> Pagamento 100% seguro
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-yellow-300 font-semibold">⏰ Oferta válida apenas por tempo limitado!</p>
            <div id="countdown" className="text-2xl font-bold mt-2"></div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Perguntas Frequentes</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold mb-2">Como recebo o e-book?</h3>
              <p className="text-gray-600">Você receberá o link para download no seu email após o pagamento.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold mb-2">Posso ler em qualquer dispositivo?</h3>
              <p className="text-gray-600">Sim, o e-book é em PDF e compatível com qualquer dispositivo.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold mb-2">E se não gostar?</h3>
              <p className="text-gray-600">Oferecemos garantia de 30 dias com reembolso total.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">✨ Recomeços em Tempos de Crise</h3>
          <p className="text-gray-400 mb-6">Transformando vidas através do conhecimento</p>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="text-gray-400 hover:text-white">
              Política de Privacidade
            </a>
            <a href="#" className="text-gray-400 hover:text-white">Termos de Uso</a>
            <a href="#" className="text-gray-400 hover:text-white">Contato</a>
          </div>
          <p className="text-gray-500 text-sm">© 2025 Recomeços em Tempos de Crise. Todos os direitos reservados.</p>
        </div>
      </footer>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            function updateCountdown() {
              const now = new Date().getTime();
              const endTime = now + (24 * 60 * 60 * 1000);
              setInterval(() => {
                const currentTime = new Date().getTime();
                const timeLeft = endTime - currentTime;
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                document.getElementById('countdown').innerHTML = \`\${hours.toString().padStart(2, '0')}:\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
              }, 1000);
            }
            updateCountdown();
          `,
        }}
      />
    </div>
  );
}