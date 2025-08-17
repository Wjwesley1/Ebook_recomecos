export const metadata = {
  title: 'Recomeços em Tempos de Crise',
  description: 'Um guia transformador para superar desafios e recomeçar com confiança',
  openGraph: {
    title: 'Recomeços em Tempos de Crise',
    description: 'Um guia transformador para superar desafios e recomeçar com confiança',
    url: 'https://ebook-recomecos-frontend.onrender.com',
    images: [
      {
        url: '/og-image.jpg', // Substitua por uma imagem real se possível
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}