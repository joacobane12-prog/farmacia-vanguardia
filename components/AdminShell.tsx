'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, LogOut, ChevronRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { href: '/admin/productos', label: 'Productos', icon: Package },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-blue-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-blue-900 font-black text-sm">V</span>
          </div>
          <div>
            <p className="text-white font-black text-sm leading-tight">Farmacia</p>
            <p className="text-yellow-400 font-black text-sm leading-tight -mt-0.5">Vanguardia</p>
          </div>
        </div>
        <p className="text-blue-400 text-xs mt-2">Panel de administración</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-blue-800">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-blue-300 hover:bg-blue-800 hover:text-white text-sm transition-colors mb-1"
        >
          Ver sitio web
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-blue-300 hover:bg-blue-800 hover:text-white text-sm transition-colors"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-blue-900 shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-56 bg-blue-900 flex flex-col">
            <div className="flex justify-end p-3">
              <button onClick={() => setSidebarOpen(false)} className="text-blue-300 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-4 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700">
            <Menu size={22} />
          </button>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700">
              {NAV.find(n => pathname === n.href || pathname.startsWith(n.href + '/'))?.label || 'Admin'}
            </p>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
