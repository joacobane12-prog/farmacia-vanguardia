import { MapPin, Clock, Phone, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const WHATSAPP_URL = `https://wa.me/598097572591?text=${encodeURIComponent('¡Hola! Tengo una consulta.')}`;

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-700 rounded-xl flex items-center justify-center">
                <span className="text-yellow-400 text-lg font-black">V</span>
              </div>
              <div>
                <p className="font-black text-white leading-tight">Farmacia</p>
                <p className="font-black text-yellow-400 leading-tight -mt-0.5">Vanguardia</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              Tu farmacia de confianza en Montevideo. Calidad, atención personalizada y los mejores precios para toda la familia.
            </p>
            <Link
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              <MessageCircle size={16} />
              Contactar por WhatsApp
            </Link>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Ubicación</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-yellow-400 mt-0.5 shrink-0" />
                <span className="text-gray-400">Francisco Bilbao 3759<br />11300, Montevideo, Uruguay</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-yellow-400 shrink-0" />
                <span className="text-gray-400">+598 097 572 591</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Horarios</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2.5">
                <Clock size={15} className="text-yellow-400 mt-0.5 shrink-0" />
                <div className="text-gray-400">
                  <p className="font-semibold text-white">Lunes a Sábado</p>
                  <p>9:00 – 20:00 hs</p>
                </div>
              </li>
              <li className="ml-6 text-gray-500 text-xs">Domingos cerrado</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© 2025 Farmacia Vanguardia. Todos los derechos reservados.</p>
          <Link href="/admin" className="hover:text-gray-400 transition-colors">
            Panel admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
