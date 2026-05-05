import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '598097572591';
const DEFAULT_MESSAGE = '¡Hola! Tengo una consulta sobre la farmacia.';

export default function WhatsAppButton() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl flex items-center gap-2 transition-all hover:scale-105 group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={26} fill="white" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm font-semibold pr-0 group-hover:pr-1">
        ¿Tenés dudas?
      </span>
    </Link>
  );
}
