import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const dataPath = join(process.cwd(), 'data', 'products.json');

function readProducts() {
  try {
    return JSON.parse(readFileSync(dataPath, 'utf8'));
  } catch {
    return [];
  }
}

function writeProducts(products: unknown[]) {
  writeFileSync(dataPath, JSON.stringify(products, null, 2), 'utf8');
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = readProducts();
  const product = products.find((p: { id: string }) => p.id === id);
  if (!product) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = request.headers.get('x-admin-token');
  if (authHeader !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const products = readProducts();
  const idx = products.findIndex((p: { id: string }) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  products[idx] = {
    ...products[idx],
    nombre: body.nombre ?? products[idx].nombre,
    descripcion: body.descripcion ?? products[idx].descripcion,
    precio: body.precio !== undefined ? Number(body.precio) : products[idx].precio,
    categoria: body.categoria ?? products[idx].categoria,
    imagen: body.imagen ?? products[idx].imagen,
    stock: body.stock !== undefined ? Number(body.stock) : products[idx].stock,
    activo: body.activo !== undefined ? body.activo : products[idx].activo,
    destacado: body.destacado !== undefined ? body.destacado : products[idx].destacado,
  };

  writeProducts(products);
  return NextResponse.json(products[idx]);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = request.headers.get('x-admin-token');
  if (authHeader !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  const products = readProducts();
  const filtered = products.filter((p: { id: string }) => p.id !== id);
  if (filtered.length === products.length) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }
  writeProducts(filtered);
  return NextResponse.json({ ok: true });
}
