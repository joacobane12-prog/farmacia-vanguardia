'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/ProductForm';
import { Product } from '@/context/CartContext';

export default function NuevoProductoPage() {
  const router = useRouter();
  const [token, setToken] = useState('');

  useEffect(() => {
    const tok = localStorage.getItem('admin_token');
    if (!tok) { router.push('/admin'); return; }
    setToken(tok);
  }, [router]);

  const handleSubmit = async (data: Partial<Product>) => {
    const res = await fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear');
  };

  if (!token) return null;

  return <ProductForm title="Nuevo producto" onSubmit={handleSubmit} />;
}
