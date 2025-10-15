import React from 'react';
import { Bus, User, Search, Ticket, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <Bus className="h-8 w-8 text-brand-blue" />
              <span className="text-2xl font-bold text-gray-800">Excursão Comadesma</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
               <Link to="/" className="flex items-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                 <Ticket className="h-5 w-5 mr-1" />
                 Nova Reserva
               </Link>
               <Link to="/consultar-reserva" className="flex items-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                 <Search className="h-5 w-5 mr-1" />
                 Consultar Reserva
               </Link>
               {isAdmin ? (
                  <button onClick={handleLogout} className="flex items-center bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium">
                    <LogOut className="h-5 w-5 mr-1" />
                    Sair
                  </button>
               ) : (
                <Link to="/admin/login" className="flex items-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  <User className="h-5 w-5 mr-1" />
                  Acesso Admin
                </Link>
               )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
