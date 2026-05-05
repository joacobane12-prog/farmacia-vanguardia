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

export async function GET() {
  const products = readProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const authHeader = request.headers.get('x-admin-token');
  if (authHeader !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const products = readProducts();

  const newProduct = {
    id: Date.now().toString(),
    nombre: body.nombre || '',
    descripcion: body.descripcion || '',
    precio: Number(body.precio) || 0,
    categoria: body.categoria || 'medicamentos',
    imagen: body.imagen || '',
    stock: Number(body.stock) || 0,
    activo: body.activo !== false,
    destacado: body.destacado === true,
  };

  products.push(newProduct);
  writeProducts(products);

  return NextResponse.json(newProduct, { status: 201 });
}
