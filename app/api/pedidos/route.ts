import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { sendCancellationEmail } from '@/lib/mailer';

const dataPath = join(process.cwd(), 'data', 'orders.json');
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

interface Order {
  id: string;
  fecha: string;
  estado: string;
  cliente: { nombre: string; apellido: string; email: string; telefono: string };
  items: Array<{ id: string; nombre: string; precio: number; cantidad: number; categoria: string }>;
  total: number;
}

function readOrders(): Order[] {
  try { return JSON.parse(readFileSync(dataPath, 'utf8')); }
  catch { return []; }
}

function writeOrders(orders: Order[]) {
  writeFileSync(dataPath, JSON.stringify(orders, null, 2), 'utf8');
}

async function cancelExpiredOrders(orders: Order[]): Promise<boolean> {
  const now = Date.now();
  let changed = false;

  for (const order of orders) {
    if (order.estado === 'pendiente') {
      const age = now - new Date(order.fecha).getTime();
      if (age > TWENTY_FOUR_HOURS) {
        order.estado = 'cancelado';
        changed = true;
        try {
          await sendCancellationEmail(order);
        } catch (err) {
          console.error(`Email cancelación ${order.id}:`, err);
        }
      }
    }
  }

  return changed;
}

export async function GET() {
  const orders = readOrders();
  const changed = await cancelExpiredOrders(orders);
  if (changed) writeOrders(orders);
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const body = await request.json();
  const orders = readOrders();

  const newOrder: Order = {
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
