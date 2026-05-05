'use client';

import { ShoppingCart, CheckCircle, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/context/CartContext';
import { useState } from 'react';

const CATEGORY_LABELS: Record<string, string> = {
  medicamentos: 'Medicamentos',
  cosmetica: 'Cosmética',
  higiene: 'Higiene',
};

const CATEGORY_BG: Record<string, string> = {
  medicamentos: 'bg-blue-50',
  cosmetica: 'bg-pink-50',
  higiene: 'bg-emerald-50',
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = items.find(i => i.id === product.id);

  const handleAdd = () => {
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Image area */}
      <div className={`relative ${CATEGORY_BG[product.categoria] || 'bg-gray-50'} aspect-square flex items-center justify-center overflow-hidden`}>
        {product.imagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imagen}
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <Package size={28} className="text-gray-400" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            product.categoria === 'medicamentos' ? 'bg-blue-600 text-white' :
            product.categoria === 'cosmetica' ? 'bg-pink-500 text-white' :
            'bg-emerald-600 text-white'
          }`}>
            {CATEGORY_LABELS[product.categoria] || product.categoria}
          </span>
          {isLowStock && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              ¡Últimas!
            </span>
          )}
        </div>

        {inCart && (
          <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-black shadow-md">
            {inCart.cantidad}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.nombre}
        </h3>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
          {product.descripcion}
        </p>

        <div className="mt-2 pt-3 border-t border-gray-100 flex items-end justify-between gap-2">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Precio</p>
            <p className="text-2xl font-black text-blue-700 leading-tight">
              ${product.precio.toLocaleString('es-UY')}
            </p>
            <p className="text-xs text-gray-400">pesos uruguayos</p>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : justAdded
                ? 'bg-green-500 text-white scale-95 shadow-md'
                : 'bg-blue-700 hover:bg-blue-800 active:scale-95 text-white shadow-sm hover:shadow-md'
            }`}
          >
            {isOutOfStock ? (
              'Sin stock'
            ) : justAdded ? (
              <>
                <CheckCircle size={15} />
                Listo
              </>
            ) : (
              <>
                <ShoppingCart size={15} />
                Agregar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
