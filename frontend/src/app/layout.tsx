import { Inter } from 'next/font/google';
import './styles.css';
import { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'Recomeços em Tempos de Crise',
  description: 'Um guia transformador para superar desafios e recomeçar com confiança',
  openGraph: {
    title: 'Recomeços em Tempos de Crise',
    description: 'Adquira o e-book Recomeços por apenas R$19,90 e transforme sua vida!',
    url: 'https://ebook-recomecos-frontend.onrender.com',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'E-book Recomeços',
      },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}