'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Package, ShoppingCart } from 'lucide-react';

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart size={40} className="text-blue-300" />
        </div>
        <h1 className="text-2xl font-black text-gray-700 mb-2">Tu carrito está vacío</h1>
        <p className="text-gray-400 mb-8 max-w-xs">Agregá productos para hacer tu pedido y retirarlo en nuestro local.</p>
        <Link
          href="/productos"
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
        >
          <Package size={18} />
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800">
            Mi carrito
            <span className="ml-3 text-lg font-semibold text-gray-400">
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            </span>
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
        {/* Items */}
        <div className="flex-1 space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 items-center hover:shadow-md transition-shadow">
              {/* Product icon / image */}
              <div className={`w-20 h-20 rounded-xl flex items-center justify-center shrink-0 text-3xl ${
                item.categoria === 'medicamentos' ? 'bg-blue-50' :
                item.categoria === 'cosmetica' ? 'bg-pink-50' : 'bg-emerald-50'
              }`}>
                {item.imagen ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Package size={24} className="text-gray-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold mb-0.5 ${
                  item.categoria === 'medicamentos' ? 'text-blue-600' :
                  item.categoria === 'cosmetica' ? 'text-pink-600' : 'text-emerald-600'
                }`}>
                  {item.categoria === 'medicamentos' ? 'Medicamentos' : item.categoria === 'cosmetica' ? 'Cosmética' : 'Higiene'}
                </p>
                <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2">{item.nombre}</h3>
                <p className="text-blue-700 font-black text-lg mt-1">
                  ${(item.precio * item.cantidad).toLocaleString('es-UY')}
                </p>
                <p className="text-xs text-gray-400">${item.precio.toLocaleString('es-UY')} c/u</p>
              </div>

              {/* Quantity */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                    className="w-9 h-9 bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-9 text-center font-black text-gray-800 text-sm">{item.cantidad}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                    disabled={item.cantidad >= item.stock}
                    className="w-9 h-9 bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-30"
                  >
                    <Plus size={13} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}

          <Link href="/productos" className="block text-center text-sm text-blue-700 hover:text-blue-800 font-semibold py-2">
            + Agregar más productos
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-32">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-black text-gray-800 text-lg mb-4">Resumen del pedido</h2>
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span className="truncate mr-2 flex-1">{item.nombre}</span>
                    <span className="shrink-0 font-semibold">×{item.cantidad}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700">Total</span>
                <span className="text-2xl font-black text-blue-700">${totalPrice.toLocaleString('es-UY')}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Pesos uruguayos · IVA incluido</p>
            </div>

            <div className="p-5">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
                <p className="text-xs text-blue-700 font-semibold">
                  Retiro solo en local<br />
                  <span className="font-normal text-blue-600">Francisco Bilbao 3759 · Lun–Sáb 9–20 hs</span>
                </p>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-blue-700/20"
              >
                <ShoppingBag size={18} />
                Confirmar pedido
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
