'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X, Phone, Clock, MapPin, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  { id: 'medicamentos', label: 'Medicamentos' },
  { id: 'cosmetica', label: 'Cosmética' },
  { id: 'higiene', label: 'Higiene' },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/productos?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top info bar */}
      <div className="bg-blue-900 text-blue-100 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin size={11} className="text-yellow-400" />
              Francisco Bilbao 3759, Mvd
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Phone size={11} className="text-yellow-400" />
              +598 097 572 591
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Clock size={11} className="text-yellow-400" />
            Lun–Sáb: 9:00 – 20:00 hs
          </span>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 bg-blue-700 rounded-xl flex items-center justify-center">
                <span className="text-yellow-400 text-lg font-black">V</span>
              </div>
              <div className="hidden sm:block">
                <p className="font-black text-blue-800 leading-tight text-base">Farmacia</p>
                <p className="font-black text-yellow-500 leading-tight text-base -mt-0.5">Vanguardia</p>
              </div>
            </Link>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto hidden sm:flex">
              <div className="flex w-full rounded-xl overflow-hidden border-2 border-blue-700 focus-within:border-blue-600">
                <input
                  type="text"
                  placeholder="Buscar medicamentos, cosméticos..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-sm focus:outline-none bg-white text-gray-800 placeholder-gray-400"
                />
                <button type="submit" className="bg-blue-700 hover:bg-blue-800 px-4 flex items-center justify-center transition-colors">
                  <Search size={18} className="text-white" />
                </button>
              </div>
            </form>

            {/* Cart + menu */}
            <div className="flex items-center gap-3 ml-auto">
              <Link href="/carrito" className="relative flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl px-3 py-2 transition-colors">
                <ShoppingCart size={20} />
                <span className="hidden sm:block text-sm font-semibold">Carrito</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 text-xs font-black rounded-full w-5 h-5 flex items-center justify-center leading-none">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>
              <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden p-2 text-gray-600">
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category bar */}
      <div className="bg-blue-700 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1">
            <Link href="/productos" className="px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 transition-colors whitespace-nowrap">
              Todos los productos
            </Link>
            <div className="w-px h-4 bg-blue-500" />
            {CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                href={`/productos?categoria=${cat.id}`}
                className="px-4 py-2.5 text-sm font-medium text-blue-100 hover:bg-blue-600 hover:text-white transition-colors whitespace-nowrap"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-b border-gray-200 shadow-lg">
          <form onSubmit={handleSearch} className="p-4">
            <div className="flex rounded-xl overflow-hidden border-2 border-blue-700">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm focus:outline-none"
              />
              <button type="submit" className="bg-blue-700 px-4 flex items-center">
                <Search size={18} className="text-white" />
              </button>
            </div>
          </form>
          <nav className="pb-4 px-4 flex flex-col gap-1">
            {[
              { href: '/productos', label: 'Todos los productos' },
              ...CATEGORIES.map(c => ({ href: `/productos?categoria=${c.id}`, label: c.label })),
            ].map(item => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
