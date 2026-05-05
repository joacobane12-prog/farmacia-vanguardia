'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreditCard, Lock, ChevronDown, ChevronUp, Package, CheckCircle, AlertCircle, ShoppingCart } from 'lucide-react';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<'datos' | 'pago' | 'procesando'>('datos');
  const [showSummary, setShowSummary] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [datos, setDatos] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    ci: '',
  });

  const [pago, setPago] = useState({
    numero: '',
    titular: '',
    vencimiento: '',
    cvv: '',
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

  const validateDatos = () => {
    const e: Record<string, string> = {};
    if (!datos.nombre.trim()) e.nombre = 'Requerido';
    if (!datos.apellido.trim()) e.apellido = 'Requerido';
    if (!datos.email.includes('@')) e.email = 'Email inválido';
    if (datos.telefono.length < 8) e.telefono = 'Teléfono inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePago = () => {
    const e: Record<string, string> = {};
    const num = pago.numero.replace(/\s/g, '');
    if (num.length < 16) e.numero = 'Número de tarjeta inválido';
    if (!pago.titular.trim()) e.titular = 'Requerido';
    if (!/^\d{2}\/\d{2}$/.test(pago.vencimiento)) e.vencimiento = 'Formato MM/AA';
    if (pago.cvv.length < 3) e.cvv = 'CVV inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleDatosNext = () => {
    if (validateDatos()) setStep('pago');
  };

  const handlePago = async () => {
    if (!validatePago()) return;
    setStep('procesando');
    await new Promise(r => setTimeout(r, 2500));
    clearCart();
    router.push(`/pedido-confirmado?nombre=${encodeURIComponent(datos.nombre)}&email=${encodeURIComponent(datos.email)}&total=${totalPrice}`);
  };

  const formatCardNumber = (v: string) => {
    return v.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
  };

  const formatExpiry = (v: string) => {
    return v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* MercadoPago-style header */}
      <div className="bg-blue-700 text-white rounded-2xl p-5 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
            <CreditCard size={20} className="text-blue-900" />
          </div>
          <div>
            <p className="font-bold text-lg">Pago seguro</p>
            <p className="text-blue-200 text-sm">Procesado por MercadoPago</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-green-500/20 border border-green-400/30 text-green-300 text-sm font-medium px-3 py-1.5 rounded-full">
          <Lock size={13} />
          Sitio seguro
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {/* Steps indicator */}
          <div className="flex items-center gap-3 mb-8">
            {[
              { key: 'datos', label: 'Tus datos', num: 1 },
              { key: 'pago', label: 'Pago', num: 2 },
            ].map((s, idx) => (
              <div key={s.key} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === s.key ? 'bg-blue-700 text-white' :
                  (step === 'pago' && s.key === 'datos') || step === 'procesando' ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {(step === 'pago' && s.key === 'datos') || step === 'procesando' && idx === 0
                    ? <CheckCircle size={16} />
                    : s.num}
                </div>
                <span className={`text-sm font-medium ${step === s.key ? 'text-blue-700' : 'text-gray-400'}`}>
                  {s.label}
                </span>
                {idx < 1 && <div className="w-8 h-px bg-gray-200 mx-1" />}
              </div>
            ))}
          </div>

          {/* Step: Datos */}
          {step === 'datos' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-800 text-xl mb-5">Tus datos de contacto</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'nombre', label: 'Nombre', placeholder: 'Juan', type: 'text' },
                  { key: 'apellido', label: 'Apellido', placeholder: 'García', type: 'text' },
                  { key: 'email', label: 'Email', placeholder: 'juan@ejemplo.com', type: 'email' },
                  { key: 'telefono', label: 'Teléfono', placeholder: '09X XXX XXX', type: 'tel' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={datos[field.key as keyof typeof datos]}
                      onChange={e => setDatos(prev => ({ ...prev, [field.key]: e.target.value }))}
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
                onClick={handleDatosNext}
                className="mt-6 w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Continuar al pago
              </button>
            </div>
          )}

          {/* Step: Pago */}
          {step === 'pago' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-800 text-xl mb-5">Datos de tarjeta</h2>

              <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-2xl p-5 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-10 translate-x-10" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-10 -translate-x-10" />
                <p className="font-mono text-xl tracking-widest mb-4">
                  {pago.numero || '•••• •••• •••• ••••'}
                </p>
                <div className="flex justify-between">
                  <div>
                    <p className="text-blue-300 text-xs">Titular</p>
                    <p className="font-medium">{pago.titular || 'NOMBRE APELLIDO'}</p>
                  </div>
                  <div>
                    <p className="text-blue-300 text-xs">Vence</p>
                    <p className="font-medium">{pago.vencimiento || 'MM/AA'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={pago.numero}
                    onChange={e => setPago(p => ({ ...p, numero: formatCardNumber(e.target.value) }))}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono ${errors.numero ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                    maxLength={19}
                  />
                  {errors.numero && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.numero}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del titular</label>
                  <input
                    type="text"
                    placeholder="Como aparece en la tarjeta"
                    value={pago.titular}
                    onChange={e => setPago(p => ({ ...p, titular: e.target.value.toUpperCase() }))}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.titular ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                  />
                  {errors.titular && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.titular}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vencimiento</label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      value={pago.vencimiento}
                      onChange={e => setPago(p => ({ ...p, vencimiento: formatExpiry(e.target.value) }))}
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono ${errors.vencimiento ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      maxLength={5}
                    />
                    {errors.vencimiento && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.vencimiento}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      placeholder="•••"
                      value={pago.cvv}
                      onChange={e => setPago(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono ${errors.cvv ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      maxLength={4}
                    />
                    {errors.cvv && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.cvv}</p>}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setStep('datos')}
                  className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                >
                  Atrás
                </button>
                <button
                  onClick={handlePago}
                  className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Lock size={16} />
                  Pagar ${totalPrice.toLocaleString('es-UY')}
                </button>
              </div>
            </div>
          )}

          {/* Step: Procesando */}
          {step === 'procesando' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="w-16 h-16 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <p className="text-xl font-bold text-gray-700">Procesando tu pago...</p>
              <p className="text-gray-500 mt-2">No cierres esta ventana</p>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:w-80">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="w-full p-4 flex items-center justify-between font-bold text-gray-800 hover:bg-gray-50 lg:cursor-default"
            >
              <span className="flex items-center gap-2">
                <Package size={18} className="text-blue-700" />
                Resumen del pedido
              </span>
              <span className="lg:hidden">{showSummary ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
            </button>
            <div className={`${showSummary ? 'block' : 'hidden lg:block'} border-t border-gray-100`}>
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
                <p className="text-xs text-gray-500 mt-1">Pesos uruguayos · IVA incluido</p>
              </div>
              <div className="bg-yellow-50 border-t border-yellow-100 p-4">
                <p className="text-xs text-yellow-800 font-medium">
                  Retirá en: Francisco Bilbao 3759, Montevideo<br />
                  Lun–Sáb: 9:00–20:00 hs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
