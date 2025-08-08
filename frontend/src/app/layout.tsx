import { Inter } from 'next/font/google';
import './globals.css';
import { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata = {
  title: 'Recomeços em Tempos de Crise',
  description: 'Um guia transformador para superar desafios e recomeçar com confiança',
  metadataBase: new URL('https://ebook-recomecos-frontend.onrender.com'),
  openGraph: {
    title: 'Recomeços em Tempos de Crise',
    description: 'Adquira o e-book Recomeços por apenas R$19,90 e transforme sua vida!',
    url: 'https://ebook-recomecos-frontend.onrender.com',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'E-book Recomeços' }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <script
          src="https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro-checkout-transparent.js"
          data-pagseguro-public-key={process.env.PAGBANK_ACCESS_TOKEN} // Ajustar pra Public Key se necessário
        ></script>
      </head>
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}