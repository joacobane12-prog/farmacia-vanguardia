'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/context/CartContext';
import { Suspense } from 'react';

const CATEGORIAS = [
  { id: '', label: 'Todos' },
  { id: 'medicamentos', label: 'Medicamentos' },
  { id: 'cosmetica', label: 'Cosmética' },
  { id: 'higiene', label: 'Higiene' },
];

function ProductosContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [categoria, setCategoria] = useState(searchParams.get('categoria') || '');

  useEffect(() => {
    fetch('/api/productos')
      .then(r => r.json())
      .then(data => {
        setProducts(data.filter((p: Product) => p.activo));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCategoria(searchParams.get('categoria') || '');
    setSearch(searchParams.get('q') || '');
  }, [searchParams]);

  const filtered = products.filter(p => {
    const matchCat = !categoria || p.categoria === categoria;
    const q = search.toLowerCase();
    const matchSearch = !q || p.nombre.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const activeCat = CATEGORIAS.find(c => c.id === categoria) || CATEGORIAS[0];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800 mb-1">
            {activeCat.label === 'Todos' ? 'Todos los productos' : activeCat.label}
          </h1>
          <p className="text-gray-500 text-sm">Pedí online y retirá en Francisco Bilbao 3759, Montevideo</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Filters bar */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2 text-gray-500 text-sm font-semibold shrink-0">
            <SlidersHorizontal size={16} />
            Filtrar:
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIAS.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoria(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  categoria === cat.id
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="aspect-square bg-gray-100 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse" />
                  <div className="h-8 bg-gray-100 rounded mt-3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
            <Search size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-lg font-bold text-gray-700">No encontramos resultados</p>
            <p className="text-gray-500 text-sm mt-1 mb-6">Probá con otro término o categoría</p>
            <button
              onClick={() => { setSearch(''); setCategoria(''); }}
              className="bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-800 transition-colors"
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4 font-medium">
              {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
              {search && <> para <span className="text-gray-700 font-bold">&ldquo;{search}&rdquo;</span></>}
              {categoria && <> en <span className="text-gray-700 font-bold">{activeCat.label}</span></>}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ProductosPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 h-72 animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <ProductosContent />
    </Suspense>
  );
}
