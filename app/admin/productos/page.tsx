'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Power, Star, LogOut, Package, Pill } from 'lucide-react';
import { Product } from '@/context/CartContext';

const CATEGORIAS: Record<string, string> = {
  medicamentos: 'Medicamentos',
  cosmetica: 'Cosmética',
  higiene: 'Higiene',
};

export default function AdminProductosPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadProducts = useCallback(async (tok: string) => {
    const res = await fetch('/api/productos');
    const data = await res.json();
    setProducts(data);
    setLoading(false);
    tok; // suppress unused warning
  }, []);

  useEffect(() => {
    const tok = localStorage.getItem('admin_token');
    if (!tok) {
      router.push('/admin');
      return;
    }
    setToken(tok);
    loadProducts(tok);
  }, [router, loadProducts]);

  const handleDelete = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;
    setDeleting(id);
    await fetch(`/api/productos/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': token },
    });
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleting(null);
  };

  const toggleActivo = async (product: Product) => {
    const updated = { ...product, activo: !product.activo };
    await fetch(`/api/productos/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ activo: !product.activo }),
    });
    setProducts(prev => prev.map(p => p.id === product.id ? updated : p));
  };

  const toggleDestacado = async (product: Product) => {
    const updated = { ...product, destacado: !product.destacado };
    await fetch(`/api/productos/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ destacado: !product.destacado }),
    });
    setProducts(prev => prev.map(p => p.id === product.id ? updated : p));
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activos = products.filter(p => p.activo).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <div className="bg-blue-900 text-white px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold">
          <Pill size={20} className="text-yellow-400" />
          <span>Admin — <span className="text-yellow-400">Farmacia Vanguardia</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-blue-300 hover:text-white text-sm transition-colors" target="_blank">
            Ver sitio
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-blue-300 hover:text-white text-sm transition-colors">
            <LogOut size={16} />
            Salir
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total productos', value: products.length, color: 'text-blue-700' },
            { label: 'Activos', value: activos, color: 'text-green-600' },
            { label: 'Inactivos', value: products.length - activos, color: 'text-gray-500' },
            { label: 'Destacados', value: products.filter(p => p.destacado).length, color: 'text-yellow-600' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
          <Link
            href="/admin/productos/nuevo"
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Nuevo producto
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center text-gray-500">
            <Package size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No hay productos cargados</p>
            <Link href="/admin/productos/nuevo" className="text-blue-700 underline text-sm mt-2 block">
              Agregar el primero
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Producto</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Categoría</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Precio</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Stock</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600">Estado</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600">Destacado</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${!product.activo ? 'opacity-60' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                            <Package size={16} className="text-blue-300" />
                          </div>
                          <span className="font-medium text-gray-800 max-w-[200px] truncate">{product.nombre}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{CATEGORIAS[product.categoria] || product.categoria}</td>
                      <td className="px-4 py-3 text-right font-semibold text-blue-700">${product.precio.toLocaleString('es-UY')}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-medium ${product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-orange-500' : 'text-gray-700'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleActivo(product)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                            product.activo
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          <Power size={12} />
                          {product.activo ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleDestacado(product)}
                          className={`transition-colors ${product.destacado ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-300 hover:text-yellow-400'}`}
                        >
                          <Star size={18} fill={product.destacado ? 'currentColor' : 'none'} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/productos/${product.id}/editar`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Pencil size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id, product.nombre)}
                            disabled={deleting === product.id}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
