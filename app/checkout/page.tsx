'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ShoppingCart, MapPin, Clock, AlertCircle, AlertTriangle } from 'lucide-react';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [datos, setDatos] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
  });

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-700 mb-4">No hay productos en tu carrito</h1>
        <Link href="/productos" className="text-blue-700 underline">Ver productos</Link>
      </div>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!datos.nombre.trim()) e.nombre = 'Requerido';
    if (!datos.apellido.trim()) e.apellido = 'Requerido';
    if (!datos.email.includes('@')) e.email = 'Email inválido';
    if (datos.telefono.length < 8) e.telefono = 'Teléfono inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setEnviando(true);

    let orderId = `VAN-${Date.now().toString().slice(-6)}`;
    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente: datos,
          items: items.map(i => ({ id: i.id, nombre: i.nombre, precio: i.precio, cantidad: i.cantidad, categoria: i.categoria })),
          total: totalPrice,
        }),
      });
      if (res.ok) {
        const order = await res.json();
        orderId = order.id;
      }
    } catch { /* continue even if save fails */ }

    clearCart();
    router.push(`/pedido-confirmado?nombre=${encodeURIComponent(datos.nombre)}&email=${encodeURIComponent(datos.email)}&total=${totalPrice}&id=${orderId}`);
  };

  const fields = [
    { key: 'nombre', label: 'Nombre', placeholder: 'Juan', type: 'text' },
    { key: 'apellido', label: 'Apellido', placeholder: 'García', type: 'text' },
    { key: 'email', label: 'Email', placeholder: 'juan@ejemplo.com', type: 'email' },
    { key: 'telefono', label: 'Teléfono', placeholder: '09X XXX XXX', type: 'tel' },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-black text-gray-800 mb-6">Confirmar pedido</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="flex-1">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>Importante:</strong> Tenés <strong>24 horas</strong> para retirar tu pedido en el local.
              Pasado ese plazo, el pedido se cancela automáticamente y te avisamos por email.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 text-lg mb-5">Tus datos de contacto</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={datos[field.key]}
                    onChange={e => {
                      setDatos(prev => ({ ...prev, [field.key]: e.target.value }));
                      setErrors(prev => { const n = { ...prev }; delete n[field.key]; return n; });
                    }}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[field.key] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                  />
                  {errors[field.key] && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors[field.key]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="mt-6 w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {enviando ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Confirmar pedido'
              )}
            </button>
          </form>
        </div>

        {/* Summary */}
        <div className="lg:w-80">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-4">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2 font-bold text-gray-800">
              <Package size={18} className="text-blue-700" />
              Resumen del pedido
            </div>
            <div className="p-4 space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate mr-2">{item.nombre} ×{item.cantidad}</span>
                  <span className="font-medium shrink-0">${(item.precio * item.cantidad).toLocaleString('es-UY')}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 p-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-blue-700">${totalPrice.toLocaleString('es-UY')}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Pesos uruguayos · IVA incluido</p>
            </div>
            <div className="bg-gray-50 border-t border-gray-100 p-4 space-y-3">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin size={15} className="text-blue-700 mt-0.5 shrink-0" />
                Francisco Bilbao 3759, Montevideo
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <Clock size={15} className="text-blue-700 mt-0.5 shrink-0" />
                Lun–Sáb: 9:00 – 20:00 hs
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
