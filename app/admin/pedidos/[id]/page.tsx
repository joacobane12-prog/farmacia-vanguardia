'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import Link from 'next/link';
import { ArrowLeft, User, Phone, Mail, Package, Clock, CheckCircle, XCircle, ChevronDown } from 'lucide-react';

interface Order {
  id: string; fecha: string; estado: string; total: number;
  cliente: { nombre: string; apellido: string; email: string; telefono: string };
  items: { id: string; nombre: string; precio: number; cantidad: number; categoria: string }[];
}

const ESTADO_STYLES: Record<string, string> = {
  pendiente: 'bg-amber-50 text-amber-700 border border-amber-200',
  retirado: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  cancelado: 'bg-red-50 text-red-700 border border-red-200',
};

const CAT_COLORS: Record<string, string> = {
  medicamentos: 'bg-blue-100 text-blue-700',
  cosmetica: 'bg-pink-100 text-pink-700',
  higiene: 'bg-emerald-100 text-emerald-700',
};

export default function PedidoDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const tok = localStorage.getItem('admin_token');
    if (!tok) { router.push('/admin'); return; }
    setToken(tok);
    fetch(`/api/pedidos/${id}`).then(r => r.json()).then(data => {
      setOrder(data);
      setLoading(false);
    }).catch(() => router.push('/admin/pedidos'));
  }, [id, router]);

  const updateEstado = async (estado: string) => {
    if (!order) return;
    setUpdating(true);
    await fetch(`/api/pedidos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ estado }),
    });
    setOrder(prev => prev ? { ...prev, estado } : prev);
    setUpdating(false);
  };

  if (loading || !order) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="max-w-3xl space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/admin/pedidos" className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-black text-gray-800 font-mono">{order.id}</h1>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${ESTADO_STYLES[order.estado]}`}>
                {order.estado === 'retirado' && <CheckCircle size={11} />}
                {order.estado === 'cancelado' && <XCircle size={11} />}
                {order.estado === 'pendiente' && <Clock size={11} />}
                {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
              </span>
            </div>
            <p className="text-gray-400 text-xs mt-0.5">
              {new Date(order.fecha).toLocaleDateString('es-UY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {' · '}
              {new Date(order.fecha).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })} hs
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Customer info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-4">Datos del comprador</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <User size={16} className="text-blue-700" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">{order.cliente.nombre} {order.cliente.apellido}</p>
                  <p className="text-xs text-gray-400">Nombre completo</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={16} className="text-blue-700" />
                </div>
                <div>
                  <p className="text-gray-800 text-sm">{order.cliente.email}</p>
                  <p className="text-xs text-gray-400">Email</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Phone size={16} className="text-blue-700" />
                </div>
                <div>
                  <p className="text-gray-800 text-sm">{order.cliente.telefono}</p>
                  <p className="text-xs text-gray-400">Teléfono</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status + summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-4">Resumen</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Productos</span>
                <span className="font-semibold text-gray-700">{order.items.reduce((s, i) => s + i.cantidad, 0)} unidades</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Método de pago</span>
                <span className="font-semibold text-gray-700">MercadoPago</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="font-bold text-gray-700">Total</span>
                <span className="text-xl font-black text-blue-700">${order.total.toLocaleString('es-UY')}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2 font-semibold">Cambiar estado</p>
              <div className="relative">
                <select
                  value={order.estado}
                  disabled={updating}
                  onChange={e => updateEstado(e.target.value)}
                  className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-60 cursor-pointer"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="retirado">Retirado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Productos del pedido</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {order.items.map((item, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                  <Package size={18} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{item.nombre}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CAT_COLORS[item.categoria] || 'bg-gray-100 text-gray-600'}`}>
                    {item.categoria}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-800">${(item.precio * item.cantidad).toLocaleString('es-UY')}</p>
                  <p className="text-xs text-gray-400">${item.precio.toLocaleString('es-UY')} × {item.cantidad}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">Total del pedido</span>
            <span className="text-xl font-black text-blue-700">${order.total.toLocaleString('es-UY')}</span>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
