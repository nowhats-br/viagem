import React from 'react';
import { Bus, ShieldCheck, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <Bus className="h-8 w-8 text-brand-purple" />
              <span className="text-2xl font-bold text-gray-800">Expresso do Sul</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
               <Link to="/admin" className="flex items-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                 <User className="h-5 w-5 mr-1" />
                 Acesso Admin
               </Link>
               <a href="#" className="flex items-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                 <ShieldCheck className="h-5 w-5 mr-1" />
                 Segurança
               </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
