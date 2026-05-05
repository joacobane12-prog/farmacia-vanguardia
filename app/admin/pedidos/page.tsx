'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import Link from 'next/link';
import { Search, X, Clock, CheckCircle, XCircle, Eye, ChevronDown } from 'lucide-react';
import { Suspense } from 'react';

interface Order {
  id: string; fecha: string; estado: string; total: number;
  cliente: { nombre: string; apellido: string; email: string; telefono: string };
  items: { id: string; nombre: string; precio: number; cantidad: number }[];
}

const ESTADO_STYLES: Record<string, string> = {
  pendiente: 'bg-amber-50 text-amber-700 border-amber-200',
  retirado: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelado: 'bg-red-50 text-red-700 border-red-200',
};

const ESTADO_ICONS: Record<string, React.ReactNode> = {
  pendiente: <Clock size={12} />,
  retirado: <CheckCircle size={12} />,
  cancelado: <XCircle size={12} />,
};

function PedidosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState(searchParams.get('estado') || '');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const tok = localStorage.getItem('admin_token');
    if (!tok) { router.push('/admin'); return; }
    setToken(tok);
    fetch('/api/pedidos').then(r => r.json()).then(data => {
      setOrders([...data].sort((a: Order, b: Order) => b.fecha.localeCompare(a.fecha)));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [router]);

  const updateEstado = async (id: string, estado: string) => {
    setUpdating(id);
    await fetch(`/api/pedidos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ estado }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, estado } : o));
    setUpdating(null);
  };

  const filtered = orders.filter(o => {
    const matchEstado = !estadoFilter || o.estado === estadoFilter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      o.id.toLowerCase().includes(q) ||
      o.cliente.nombre.toLowerCase().includes(q) ||
      o.cliente.apellido.toLowerCase().includes(q) ||
      o.cliente.email.toLowerCase().includes(q);
    return matchEstado && matchSearch;
  });

  const pendingCount = orders.filter(o => o.estado === 'pendiente').length;

  return (
    <AdminShell>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-gray-800">Pedidos</h1>
            <p className="text-gray-500 text-sm">{orders.length} pedidos totales · {pendingCount} pendientes</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Buscar por ID, nombre o email..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={13} /></button>}
          </div>
          <div className="flex gap-2">
            {[
              { id: '', label: 'Todos' },
              { id: 'pendiente', label: 'Pendientes' },
              { id: 'retirado', label: 'Retirados' },
              { id: 'cancelado', label: 'Cancelados' },
            ].map(f => (
              <button key={f.id} onClick={() => setEstadoFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${
                  estadoFilter === f.id ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-8 h-8 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
            <p className="text-lg font-semibold">No se encontraron pedidos</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Pedido', 'Cliente', 'Fecha', 'Productos', 'Total', 'Estado', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(order => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-mono text-blue-700 font-bold text-xs">{order.id}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800">{order.cliente.nombre} {order.cliente.apellido}</p>
                        <p className="text-xs text-gray-400">{order.cliente.email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                        {new Date(order.fecha).toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                        <br />
                        {new Date(order.fecha).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-700 text-xs">{order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}</p>
                        <p className="text-gray-400 text-xs truncate max-w-[140px]">
                          {order.items.map(i => i.nombre.split(' ').slice(0, 2).join(' ')).join(', ')}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-black text-gray-800 whitespace-nowrap">
                        ${order.total.toLocaleString('es-UY')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          <select
                            value={order.estado}
                            disabled={updating === order.id}
                            onChange={e => updateEstado(order.id, e.target.value)}
                            className={`appearance-none text-xs font-semibold px-2.5 py-1.5 pr-6 rounded-full border cursor-pointer focus:outline-none disabled:opacity-60 ${ESTADO_STYLES[order.estado]}`}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="retirado">Retirado</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                          <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/pedidos/${order.id}`}
                          className="p-1.5 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center">
                          <Eye size={15} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

export default function PedidosPage() {
  return (
    <Suspense fallback={<AdminShell><div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" /></div></AdminShell>}>
      <PedidosContent />
    </Suspense>
  );
}
