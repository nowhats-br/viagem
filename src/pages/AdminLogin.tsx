import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Loader2 } from 'lucide-react';

const logoUrl = 'https://www.comadesma.com.br/assets/img/logo.png';

const AdminLogin: React.FC = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const success = await login(pin);
    if (success) {
      navigate('/admin');
    } else {
      setError('PIN inválido. Tente novamente.');
      setPin('');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center mt-10 md:mt-20">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <img src={logoUrl} alt="COMADESMA Logo" className="w-20 h-20 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-dark-text">Acesso Administrativo</h2>
          <p className="mt-2 text-medium-text">Insira o PIN de segurança para continuar.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="relative">
            <Lock className="h-6 w-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              id="pin"
              name="pin"
              type="password"
              autoComplete="off"
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="block w-full text-center tracking-[0.5em] text-3xl font-semibold pl-16 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition"
              placeholder="••••••"
              maxLength={6}
            />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-brand-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:bg-blue-300 transition-colors"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
