'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Pill, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('admin_token', data.token);
        router.push('/admin/dashboard');
      } else {
        setError('Contraseña incorrecta');
      }
    } catch {
      setError('Error al conectar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-blue-700 font-bold text-2xl mb-2">
            <Pill size={28} className="text-yellow-500" />
            Farmacia Vanguardia
          </div>
          <p className="text-gray-500">Panel de administración</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Lock size={20} className="text-blue-700" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800">Acceso al panel</h1>
              <p className="text-sm text-gray-500">Ingresá tu contraseña de administrador</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 ${error ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={16} />
                  Ingresar
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
