// Remove "use client" se não houver estado
import Link from 'next/link';

export default function Nav() {
  return (
    <nav>
      <a href="/">Home</a>
      {/* Remova <a href="/checkout">Comprar</a> */}
    </nav>
  );
}