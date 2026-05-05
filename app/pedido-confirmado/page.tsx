'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, MapPin, Clock, ShoppingBag } from 'lucide-react';

function ConfirmadoContent() {
  const params = useSearchParams();
  const nombre = params.get('nombre') || 'Cliente';
  const email = params.get('email') || '';
  const total = params.get('total') || '0';

  const orderId = `VAN-${Date.now().toString().slice(-6)}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={48} className="text-green-500" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Pedido confirmado!</h1>
      <p className="text-gray-500 text-lg mb-1">Gracias, <span className="font-semibold text-gray-700">{nombre}</span></p>
      {email && <p className="text-gray-400 text-sm mb-8">Confirmación enviada a <span className="font-medium">{email}</span></p>}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 text-left">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">N° de pedido</p>
            <p className="font-bold text-blue-700 font-mono">{orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total pagado</p>
            <p className="font-bold text-gray-800 text-xl">${Number(total).toLocaleString('es-UY')}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-blue-700 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-gray-700">Dirección de retiro</p>
              <p className="text-gray-500 text-sm">Francisco Bilbao 3759, Montevideo, Uruguay</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock size={18} className="text-blue-700 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-gray-700">Horario de atención</p>
              <p className="text-gray-500 text-sm">Lunes a Sábado: 9:00 – 20:00 hs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8">
        <p className="text-blue-800 font-medium">
          Tu pedido estará listo para retirar en el local. Presentá el número de pedido al momento del retiro.
        </p>
      </div>

      <Link
        href="/productos"
        className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl transition-colors"
      >
        <ShoppingBag size={18} />
        Seguir comprando
      </Link>
    </div>
  );
}

export default function PedidoConfirmadoPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-16 text-center"><div className="animate-pulse bg-gray-100 h-64 rounded-2xl" /></div>}>
      <ConfirmadoContent />
    </Suspense>
  );
}
