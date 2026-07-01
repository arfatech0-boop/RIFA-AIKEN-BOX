import React, { useState } from 'react';
import { X, User, Lock, Shield } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (user: UserType) => void;
  onRegister: (user: UserType) => void;
  users: UserType[];
}

export default function LoginModal({ onClose, onLogin, onRegister, users }: LoginModalProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (isRegistering) {
      const exists = users.find(u => u.username.toLowerCase() === username.toLowerCase());
      if (exists) {
        setError('El nombre de usuario ya está en uso.');
        return;
      }

      const newUser: UserType = {
        id: 'usr-' + Math.floor(1000 + Math.random() * 9000),
        username: username.trim(),
        password: password.trim(),
        role: 'athlete'
      };
      
      onRegister(newUser);
      onLogin(newUser);
    } else {
      // Hardcoded Admin
      if (username.toLowerCase() === 'miye' && password === 'miye123') {
        onLogin({
          id: 'admin-1',
          username: 'Miye',
          password: 'miye123',
          role: 'admin'
        });
        return;
      }

      const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError('Usuario o contraseña incorrectos.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden flex flex-col relative shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800/80 bg-zinc-900/30 flex justify-between items-center relative">
          <div>
            <h3 className="text-xl font-black tracking-tight text-white uppercase">
              {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              {isRegistering ? 'Únete a AIKEN BOX' : 'Bienvenido de nuevo'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs text-center font-medium">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Usuario</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                    placeholder="Tu nombre de usuario"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                    placeholder="Tu contraseña"
                  />
                </div>
              </div>

              {!isRegistering && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-500 focus:ring-offset-zinc-950"
                  />
                  <label htmlFor="rememberMe" className="text-xs text-zinc-400 font-medium cursor-pointer">
                    Mantener sesión iniciada
                  </label>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl uppercase tracking-wider text-sm transition-all shadow-lg shadow-red-600/20 mt-4"
            >
              {isRegistering ? 'Registrarse' : 'Ingresar'}
            </button>
          </form>
          
          <div className="text-center pt-2">
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-wider font-bold"
            >
              {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
