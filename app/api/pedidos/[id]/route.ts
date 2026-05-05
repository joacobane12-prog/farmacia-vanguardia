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

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orders = readOrders();
  const order = orders.find((o: { id: string }) => o.id === id);
  if (!order) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  return NextResponse.json(order);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = request.headers.get('x-admin-token');
  if (authHeader !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const orders = readOrders();
  const idx = orders.findIndex((o: { id: string }) => o.id === id);
  if (idx === -1) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  orders[idx] = { ...orders[idx], ...body };
  writeOrders(orders);
  return NextResponse.json(orders[idx]);
}
