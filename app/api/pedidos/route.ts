import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const dataPath = join(process.cwd(), 'data', 'orders.json');

function readOrders() {
  try { return JSON.parse(readFileSync(dataPath, 'utf8')); }
  catch { return []; }
}

function writeOrders(orders: unknown[]) {
  writeFileSync(dataPath, JSON.stringify(orders, null, 2), 'utf8');
}

export async function GET() {
  const orders = readOrders();
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const body = await request.json();
  const orders = readOrders();

  const newOrder = {
    id: `VAN-${Date.now().toString().slice(-6)}`,
    fecha: new Date().toISOString(),
    estado: 'pendiente',
    cliente: {
      nombre: body.cliente?.nombre || '',
      apellido: body.cliente?.apellido || '',
      email: body.cliente?.email || '',
      telefono: body.cliente?.telefono || '',
    },
    items: body.items || [],
    total: body.total || 0,
  };

  orders.push(newOrder);
  writeOrders(orders);

  return NextResponse.json(newOrder, { status: 201 });
}
