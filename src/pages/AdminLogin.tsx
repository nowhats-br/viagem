import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(pin);
    if (success) {
      navigate('/admin');
    } else {
      setError('PIN inválido. Tente novamente.');
      setPin('');
    }
  };

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Acesso Administrativo</h2>
          <p className="mt-2 text-gray-600">Insira o PIN para continuar.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="relative">
            <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="pin"
              name="pin"
              type="password"
              autoComplete="off"
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="block w-full text-center tracking-widest text-2xl pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
              placeholder="••••••"
            />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
