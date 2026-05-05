import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';

  if (password === adminPassword) {
    return NextResponse.json({ token: process.env.ADMIN_TOKEN || 'vanguardia-admin-token' });
  }

  return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
}
