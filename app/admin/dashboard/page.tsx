'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, ShoppingBag, Clock, DollarSign, Package, Users, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface OrderItem { id: string; nombre: string; precio: number; cantidad: number; categoria: string; }
interface Order {
  id: string; fecha: string; estado: string; total: number;
  cliente: { nombre: string; apellido: string; email: string; telefono: string };
  items: OrderItem[];
}

const ESTADO_COLORS: Record<string, string> = {
  pendiente: '#F59E0B',
  retirado: '#10B981',
  cancelado: '#EF4444',
};

const ESTADO_LABELS: Record<string, string> = {
  pendiente: 'Pendiente',
  retirado: 'Retirado',
  cancelado: 'Cancelado',
};

const CAT_COLORS: Record<string, string> = {
  medicamentos: '#3B82F6',
  cosmetica: '#EC4899',
  higiene: '#10B981',
};

function formatCurrency(n: number) {
  return `$${n.toLocaleString('es-UY')}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit' });
}

export default function DashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tok = localStorage.getItem('admin_token');
    if (!tok) { router.push('/admin'); return; }
    fetch('/api/pedidos').then(r => r.json()).then(data => {
      setOrders(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminShell>
    );
  }

  const completados = orders.filter(o => o.estado === 'retirado');
  const pendientes = orders.filter(o => o.estado === 'pendiente');
  const cancelados = orders.filter(o => o.estado === 'cancelado');
  const totalRevenue = completados.reduce((s, o) => s + o.total, 0);
  const avgTicket = completados.length > 0 ? Math.round(totalRevenue / completados.length) : 0;

  // Sales by day (last 14 days)
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const key = d.toISOString().slice(0, 10);
    const dayOrders = completados.filter(o => o.fecha.slice(0, 10) === key);
    return {
      day: formatDate(d.toISOString()),
      ventas: dayOrders.reduce((s, o) => s + o.total, 0),
      pedidos: dayOrders.length,
    };
  });

  // Orders by status for pie
  const byStatus = [
    { name: 'Retirados', value: completados.length, color: '#10B981' },
    { name: 'Pendientes', value: pendientes.length, color: '#F59E0B' },
    { name: 'Cancelados', value: cancelados.length, color: '#EF4444' },
  ].filter(s => s.value > 0);

  // Top products
  const productMap: Record<string, { nombre: string; cantidad: number; revenue: number }> = {};
  completados.forEach(o => o.items.forEach(item => {
    if (!productMap[item.id]) productMap[item.id] = { nombre: item.nombre, cantidad: 0, revenue: 0 };
    productMap[item.id].cantidad += item.cantidad;
    productMap[item.id].revenue += item.precio * item.cantidad;
  }));
  const topProducts = Object.values(productMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(p => ({ ...p, nombre: p.nombre.length > 28 ? p.nombre.slice(0, 28) + '…' : p.nombre }));

  // Revenue by category
  const catRevenue: Record<string, number> = {};
  completados.forEach(o => o.items.forEach(item => {
    catRevenue[item.categoria] = (catRevenue[item.categoria] || 0) + item.precio * item.cantidad;
  }));
  const byCat = Object.entries(catRevenue).map(([cat, val]) => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: val,
    color: CAT_COLORS[cat] || '#6B7280',
  }));

  const recentOrders = [...orders].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 6);

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Alert for pending orders */}
        {pendientes.length > 0 && (
          <Link href="/admin/pedidos?estado=pendiente"
            className="block bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-amber-100 transition-colors">
            <Clock size={18} className="text-amber-600 shrink-0" />
            <p className="text-amber-800 text-sm font-semibold">
              {pendientes.length} pedido{pendientes.length > 1 ? 's' : ''} pendiente{pendientes.length > 1 ? 's' : ''} de retiro
            </p>
            <span className="ml-auto text-amber-600 text-xs font-bold">Ver →</span>
          </Link>
        )}

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Ingresos totales', value: formatCurrency(totalRevenue),
              sub: 'Pedidos retirados', icon: DollarSign, color: 'text-blue-700', bg: 'bg-blue-50',
            },
            {
              label: 'Total pedidos', value: orders.length,
              sub: `${completados.length} completados`, icon: ShoppingBag, color: 'text-emerald-700', bg: 'bg-emerald-50',
            },
            {
              label: 'Ticket promedio', value: formatCurrency(avgTicket),
              sub: 'Por pedido completado', icon: TrendingUp, color: 'text-purple-700', bg: 'bg-purple-50',
            },
            {
              label: 'Pendientes', value: pendientes.length,
              sub: 'Por retirar', icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50',
            },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{card.label}</p>
                <div className={`w-9 h-9 ${card.bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <card.icon size={18} className={card.color} />
                </div>
              </div>
              <p className={`text-2xl font-black ${card.color}`}>{card.value}</p>
              <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Sales bar chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-4">Ingresos últimos 14 días</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={last14} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false}
                  tickFormatter={v => v === 0 ? '0' : `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: unknown) => [`$${Number(v).toLocaleString('es-UY')}`, 'Ingresos']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Bar dataKey="ventas" fill="#1D4ED8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status pie */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-4">Estado de pedidos</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={byStatus} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                  paddingAngle={3} dataKey="value">
                  {byStatus.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 mt-2">
              {byStatus.map(s => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                    <span className="text-gray-600">{s.name}</span>
                  </div>
                  <span className="font-bold text-gray-700">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top products */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-4">Productos más vendidos</h3>
            {topProducts.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">Sin datos</p>
            ) : (
              <div className="space-y-3">
                {topProducts.map((p, i) => {
                  const maxRev = topProducts[0].revenue;
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-700 font-medium truncate mr-2">{p.nombre}</span>
                        <span className="text-blue-700 font-bold shrink-0">{formatCurrency(p.revenue)}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${(p.revenue / maxRev) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{p.cantidad} unidades vendidas</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Revenue by category */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-4">Ingresos por categoría</h3>
            {byCat.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">Sin datos</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={byCat} cx="50%" cy="50%" outerRadius={70} dataKey="value" paddingAngle={3}>
                      {byCat.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: unknown) => [formatCurrency(Number(v))]}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-1.5 mt-2">
                  {byCat.map(c => (
                    <div key={c.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                        <span className="text-gray-600">{c.name}</span>
                      </div>
                      <span className="font-bold text-gray-700">{formatCurrency(c.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Pedidos recientes</h3>
            <Link href="/admin/pedidos" className="text-blue-700 text-sm font-semibold hover:text-blue-800">
              Ver todos
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Pedido</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cliente</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/admin/pedidos/${order.id}`} className="font-mono text-blue-700 hover:text-blue-800 font-semibold text-xs">
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-medium">
                      {order.cliente.nombre} {order.cliente.apellido}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(order.fecha).toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-800">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full`}
                        style={{ background: ESTADO_COLORS[order.estado] + '20', color: ESTADO_COLORS[order.estado] }}>
                        {order.estado === 'retirado' && <CheckCircle size={11} />}
                        {order.estado === 'cancelado' && <XCircle size={11} />}
                        {order.estado === 'pendiente' && <Clock size={11} />}
                        {ESTADO_LABELS[order.estado]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick stats footer */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Clientes únicos', value: new Set(orders.map(o => o.cliente.email)).size, icon: Users },
            { label: 'Productos distintos vendidos', value: new Set(completados.flatMap(o => o.items.map(i => i.id))).size, icon: Package },
            { label: 'Tasa de completado', value: orders.length > 0 ? `${Math.round((completados.length / orders.length) * 100)}%` : '0%', icon: CheckCircle },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <s.icon size={20} className="text-blue-700 mx-auto mb-2" />
              <p className="text-2xl font-black text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
