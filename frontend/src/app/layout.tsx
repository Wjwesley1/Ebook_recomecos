import { Geist_Sans, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata = {
  title: 'Ebook Recomeços',
  description: 'Um guia prático e inspirador para novos começos!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <nav className="bg-[var(--primary)] text-white p-4 flex justify-center">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
            <a href="/" className="hover:underline">Início</a>
            <a href="/sobre" className="hover:underline">Sobre</a>
            <a href="/contato" className="hover:underline">Contato</a>
            <a href="/pedidos" className="hover:underline">Pedidos</a>
          </div>
        </nav>
        {children}
        <footer className="bg-[var(--primary)] text-white text-center p-4 mt-8">
          <p>&copy; 2025 Ebook Recomeços. Todos os direitos reservados.</p>
        </footer>
        <div className="relative group">
          <a
            href="https://wa.me/5511999999999?text=Quero%20saber%20mais%20sobre%20o%20Ebook%20Recomeços"
            className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.074-.149-.669-.719-.916-.99-.246-.272-.492-.246-.669-.247-.173-.001-.371.05-.52.148-.149.099-.446.446-.642.742-.198.297-.297.694-.297 1.142s.421.892 1.017 1.338c.595.446 1.758 1.486 4.265 2.079.595.148 1.041.223 1.387.297.446.099.892.074 1.238-.074.347-.149.644-.446.841-.743.198-.297.198-.595.148-.743-.05-.149-.297-.223-.595-.372zm-5.476 7.393a6.656 6.656 0 01-3.415-.923l-.247-.148-2.545.595.595-2.495-.148-.247a6.656 6.656 0 01-1.041-3.564 6.707 6.707 0 016.707-6.707 6.657 6.657 0 014.736 1.982 6.657 6.657 0 011.982 4.736 6.707 6.707 0 01-6.707 6.707zm5.685-12.147a5.705 5.705 0 00-4.039-1.686 5.707 5.707 0 00-5.707 5.707 5.656 5.656 0 00.892 3.067l-.099.297-3.564.841.841-3.514.198-.595a5.656 5.656 0 002.792-4.996 5.707 5.707 0 015.707-5.707 5.656 5.656 0 014.039 1.686 5.656 5.656 0 011.686 4.039 5.707 5.707 0 01-5.707 5.707zm0-10.285C6.345 1.143 2.143 5.345 2.143 10.857c0 1.982.595 3.813 1.686 5.345l-1.041 3.862 3.962-1.041a8.658 8.658 0 008.707 0l3.962 1.041-1.041-3.862a8.658 8.658 0 001.686-5.345c0-5.512-4.202-9.714-9.714-9.714z" />
            </svg>
          </a>
          <span className="absolute right-0 bottom-12 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Fale conosco no WhatsApp
          </span>
        </div>
      </body>
    </html>
  );
}