import nodemailer from 'nodemailer';

interface OrderItem {
  nombre: string;
  cantidad: number;
  precio: number;
}

interface Order {
  id: string;
  cliente: { nombre: string; apellido: string; email: string };
  total: number;
  items: OrderItem[];
}

export async function sendCancellationEmail(order: Order) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const itemsList = order.items
    .map(i => `<tr>
      <td style="padding:6px 0;color:#374151;">${i.nombre}</td>
      <td style="padding:6px 0;color:#374151;text-align:center;">x${i.cantidad}</td>
      <td style="padding:6px 0;color:#374151;text-align:right;">$${(i.precio * i.cantidad).toLocaleString('es-UY')}</td>
    </tr>`)
    .join('');

  await transporter.sendMail({
    from: `"Farmacia Vanguardia" <${process.env.GMAIL_USER}>`,
    to: order.cliente.email,
    subject: `Pedido ${order.id} cancelado — Farmacia Vanguardia`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;">
        <div style="background:#1d4ed8;padding:28px 32px;border-radius:12px 12px 0 0;">
          <h1 style="color:white;margin:0;font-size:22px;">Farmacia Vanguardia</h1>
          <p style="color:#93c5fd;margin:4px 0 0;">Francisco Bilbao 3759, Montevideo</p>
        </div>
        <div style="padding:32px;background:white;border:1px solid #e5e7eb;border-top:none;">
          <p style="font-size:16px;color:#374151;margin-top:0;">
            Hola, <strong>${order.cliente.nombre} ${order.cliente.apellido}</strong>
          </p>
          <p style="color:#374151;">
            Tu pedido <strong style="color:#1d4ed8;">${order.id}</strong> fue
            <strong style="color:#ef4444;">cancelado automáticamente</strong>
            porque no fue retirado dentro de las <strong>24 horas</strong> posteriores a su confirmación.
          </p>

          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:20px 0;">
            <p style="margin:0;color:#991b1b;font-size:14px;">
              Si querés volver a realizar el pedido, podés hacerlo en cualquier momento desde nuestra tienda online.
            </p>
          </div>

          <h3 style="color:#374151;margin-bottom:12px;">Detalle del pedido cancelado:</h3>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="border-bottom:2px solid #e5e7eb;">
                <th style="text-align:left;padding:8px 0;color:#6b7280;font-size:12px;text-transform:uppercase;">Producto</th>
                <th style="text-align:center;padding:8px 0;color:#6b7280;font-size:12px;text-transform:uppercase;">Cant.</th>
                <th style="text-align:right;padding:8px 0;color:#6b7280;font-size:12px;text-transform:uppercase;">Subtotal</th>
              </tr>
            </thead>
            <tbody>${itemsList}</tbody>
            <tfoot>
              <tr style="border-top:2px solid #e5e7eb;">
                <td colspan="2" style="padding:10px 0;font-weight:bold;color:#374151;">Total</td>
                <td style="padding:10px 0;font-weight:bold;color:#1d4ed8;text-align:right;">$${order.total.toLocaleString('es-UY')} UYU</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div style="padding:20px 32px;text-align:center;color:#9ca3af;font-size:13px;">
          Farmacia Vanguardia · Lun–Sáb 9:00–20:00 hs · Tel: 097 572 591
        </div>
      </div>
    `,
  });
}
