'use client'
// import { MyContextProvider } from '../context/MyContext'; // Remova se não for usado

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}