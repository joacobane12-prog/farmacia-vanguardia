import { readFileSync } from 'fs';
import { join } from 'path';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, MapPin, Clock, Shield, Truck, HeartHandshake } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/context/CartContext';

function getProducts(): Product[] {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), 'data', 'products.json'), 'utf8'));
  } catch {
    return [];
  }
}

const CATEGORIES = [
  {
    id: 'medicamentos',
    label: 'Medicamentos',
    desc: 'Analgésicos, vitaminas y más',
    img: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800&h=400&fit=crop&auto=format',
    overlay: 'from-blue-900/80 to-blue-700/60',
  },
  {
    id: 'cosmetica',
    label: 'Cosmética',
    desc: 'Cremas, sérums y protección solar',
    img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=400&fit=crop&auto=format',
    overlay: 'from-pink-900/80 to-pink-600/60',
  },
  {
    id: 'higiene',
    label: 'Higiene',
    desc: 'Cuidado personal y desinfección',
    img: 'https://images.unsplash.com/photo-1556760544-74068565f05c?w=800&h=400&fit=crop&auto=format',
    overlay: 'from-emerald-900/80 to-emerald-600/60',
  },
];

export default function HomePage() {
  const products = getProducts();
  const featured = products.filter(p => p.destacado && p.activo).slice(0, 8);

  return (
    <div className="bg-gray-50">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden min-h-[420px] sm:min-h-[480px] flex items-center">
        {/* Pharmacy photo background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/farmacia.webp')" }}
        />
        {/* Dark overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-blue-900/70 to-blue-800/50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 w-full">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wide mb-5 shadow-sm">
              <Shield size={12} />
              Farmacia de confianza en Montevideo
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
              Todo lo que<br />
              necesitás, <span className="text-yellow-400">online.</span>
            </h1>

            <p className="text-blue-100 text-base sm:text-lg leading-relaxed mb-8">
              Comprá desde casa y retirá en nuestro local en <strong className="text-white">Francisco Bilbao 3759</strong>. Medicamentos, cosmética e higiene al mejor precio.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/productos"
                className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-black px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-yellow-400/30 text-sm sm:text-base"
              >
                <ShoppingBag size={18} />
                Ver todos los productos
              </Link>
              <Link
                href="/productos?categoria=medicamentos"
                className="bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors text-sm sm:text-base"
              >
                Medicamentos
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-black text-gray-800">Categorías</h2>
          <Link href="/productos" className="text-blue-700 hover:text-blue-800 text-sm font-semibold flex items-center gap-1">
            Ver todo <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CATEGORIES.map(cat => {
            const count = products.filter(p => p.categoria === cat.id && p.activo).length;
            return (
              <Link
                key={cat.id}
                href={`/productos?categoria=${cat.id}`}
                className="group relative overflow-hidden rounded-2xl shadow-sm h-44 block"
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${cat.img}')` }}
                />
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${cat.overlay}`} />
                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-5">
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-0.5">Categoría</p>
                  <h3 className="text-2xl font-black text-white mb-0.5">{cat.label}</h3>
                  <p className="text-white/75 text-xs mb-3">{cat.desc}</p>
                  <div className="inline-flex items-center gap-1.5 bg-white/20 group-hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full w-fit transition-colors">
                    {count} productos
                    <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-800">Productos destacados</h2>
              <p className="text-gray-500 text-sm mt-0.5">Los más elegidos de nuestra farmacia</p>
            </div>
            <Link href="/productos" className="hidden sm:flex items-center gap-1 text-blue-700 hover:text-blue-800 text-sm font-semibold">
              Ver todos <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link href="/productos" className="inline-flex items-center gap-2 border-2 border-blue-700 text-blue-700 font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 hover:text-white transition-colors">
              Ver todos los productos <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}

      {/* ─── TRUST BAR ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
            {[
              { icon: <MapPin size={18} className="text-blue-700" />, title: 'Retiro en local', desc: 'Francisco Bilbao 3759' },
              { icon: <Clock size={18} className="text-blue-700" />, title: 'Lun–Sáb', desc: '9:00 a 20:00 hs' },
              { icon: <Shield size={18} className="text-blue-700" />, title: 'Pago seguro', desc: 'Vía MercadoPago' },
              { icon: <HeartHandshake size={18} className="text-blue-700" />, title: 'Atención personalizada', desc: 'WhatsApp disponible' },
            ].map(item => (
              <div key={item.title} className="flex items-center gap-3 px-5 py-4">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROMO BANNER ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Truck size={20} className="text-blue-800" />
              <span className="text-blue-800 font-black text-sm uppercase tracking-wide">Retiro express</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-blue-900 mb-1">
              Pedí ahora, retirá hoy
            </h3>
            <p className="text-blue-800/80 text-sm">
              Hacé tu pedido online y retiralo en el día en nuestro local.
            </p>
          </div>
          <Link
            href="/productos"
            className="shrink-0 bg-blue-800 hover:bg-blue-900 text-white font-black px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-md text-sm"
          >
            Hacer pedido
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}
