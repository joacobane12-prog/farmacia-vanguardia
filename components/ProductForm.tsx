'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { Product } from '@/context/CartContext';

interface ProductFormProps {
  initial?: Partial<Product>;
  onSubmit: (data: Partial<Product>) => Promise<void>;
  title: string;
}

const CATEGORIAS = [
  { id: 'medicamentos', label: 'Medicamentos' },
  { id: 'cosmetica', label: 'Cosmética' },
  { id: 'higiene', label: 'Higiene' },
];

export default function ProductForm({ initial, onSubmit, title }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    nombre: initial?.nombre || '',
    descripcion: initial?.descripcion || '',
    precio: String(initial?.precio || ''),
    stock: String(initial?.stock || ''),
    categoria: initial?.categoria || 'medicamentos',
    imagen: initial?.imagen || '',
    activo: initial?.activo !== false,
    destacado: initial?.destacado === true,
  });

  const set = (key: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => { const e = { ...prev }; delete e[key]; return e; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    if (!form.precio || isNaN(Number(form.precio)) || Number(form.precio) < 0) e.precio = 'Precio inválido';
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) e.stock = 'Stock inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSubmit({
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        precio: Number(form.precio),
        stock: Number(form.stock),
        categoria: form.categoria,
        imagen: form.imagen.trim(),
        activo: form.activo,
        destacado: form.destacado,
      });
      router.push('/admin/productos');
    } catch (err) {
      setErrors({ submit: 'Error al guardar. Intenta de nuevo.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/admin/productos" className="text-blue-300 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-lg">{title}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del producto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={e => set('nombre', e.target.value)}
              placeholder="Ej: Paracetamol 500mg x 20 comp."
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nombre ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.nombre && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.nombre}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={e => set('descripcion', e.target.value)}
              placeholder="Descripción breve del producto..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio (UYU) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                <input
                  type="number"
                  value={form.precio}
                  onChange={e => set('precio', e.target.value)}
                  placeholder="0"
                  min="0"
                  className={`w-full pl-7 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.precio ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                />
              </div>
              {errors.precio && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.precio}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.stock}
                onChange={e => set('stock', e.target.value)}
                placeholder="0"
                min="0"
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.stock ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
              />
              {errors.stock && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.stock}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                value={form.categoria}
                onChange={e => set('categoria', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {CATEGORIAS.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen (opcional)</label>
            <input
              type="url"
              value={form.imagen}
              onChange={e => set('imagen', e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">Si no tenés imagen, se mostrará un ícono genérico.</p>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={e => set('activo', e.target.checked)}
                className="w-4 h-4 accent-blue-700"
              />
              <span className="text-sm font-medium text-gray-700">Visible en la tienda</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.destacado}
                onChange={e => set('destacado', e.target.checked)}
                className="w-4 h-4 accent-yellow-500"
              />
              <span className="text-sm font-medium text-gray-700">Producto destacado</span>
            </label>
          </div>

          {errors.submit && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} />{errors.submit}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Link
              href="/admin/productos"
              className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 sm:flex-none bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white font-bold px-6 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={16} />
                  Guardar producto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
