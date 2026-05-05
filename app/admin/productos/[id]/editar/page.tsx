'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProductForm from '@/components/ProductForm';
import { Product } from '@/context/CartContext';

export default function EditarProductoPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tok = localStorage.getItem('admin_token');
    if (!tok) { router.push('/admin'); return; }
    setToken(tok);

    fetch(`/api/productos/${id}`)
      .then(r => r.json())
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => { router.push('/admin/productos'); });
  }, [id, router]);

  const handleSubmit = async (data: Partial<Product>) => {
    const res = await fetch(`/api/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  return <ProductForm title={`Editar: ${product.nombre}`} initial={product} onSubmit={handleSubmit} />;
}
