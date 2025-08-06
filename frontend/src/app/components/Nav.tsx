// Remove "use client" se não houver estado
import Link from 'next/link';

export default function Nav() {
  console.log('Nav renderizado'); // Debug
  return (
    <nav className="bg-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-emerald-500">Recomeços</div>
        <div className="space-x-4">
          <Link href="/" className="text-indigo-500 hover:text-indigo-700">Home</Link>
          <Link href="/checkout" className="text-indigo-500 hover:text-indigo-700">Comprar</Link>
          <Link href="#" className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">Login</Link>
        </div>
      </div>
    </nav>
  );
}