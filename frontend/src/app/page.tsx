import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-indigo-50 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-indigo-600 mb-4">Ebook Recomeços</h1>
      <p className="text-lg text-gray-600 mb-6 text-center max-w-2xl">
        Bem-vindo ao <span className="font-semibold">Ebook Recomeços em Tempos de Crise</span>! 
        Descubra estratégias práticas para superar desafios e recomeçar com confiança.
      </p>
      <div className="mb-6">
        <span className="text-2xl font-bold text-white bg-gradient-to-r from-indigo-500 to-emerald-500 px-4 py-2 rounded">
          R$19,90
        </span>
        <span className="text-gray-500 line-through ml-2">R$99,90</span>
      </div>
      <Link
        href="/checkout"
        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-emerald-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition"
      >
        Comprar Agora
      </Link>
      <div className="mt-8 text-center">
        <img src="/pagbank-logo.png" alt="PagBank" className="inline-block h-8" />
        <p className="text-gray-600 mt-2">Pagamento 100% seguro com PagBank</p>
      </div>
    </div>
  );
}