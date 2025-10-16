import React, { useState } from 'react';
import { User, Search, Ticket, LogOut, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const logoUrl = 'https://www.comadesma.com.br/assets/img/logo.png';

const Header: React.FC = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/home');
  };

  const navLinks = [
    { to: '/home', icon: Ticket, text: 'Nova Reserva' },
    { to: '/consultar-reserva', icon: Search, text: 'Consultar Reserva' },
  ];

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const mobileMenuVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
    exit: { x: '100%', transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-30">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link to="/home" className="flex items-center space-x-3">
                <img src={logoUrl} alt="COMADESMA Logo" className="h-10 w-10" />
                <span className="text-lg font-bold text-dark-text hidden sm:inline">42º AGO COMADESMA</span>
              </Link>
            </div>
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="flex items-center text-medium-text hover:bg-gray-100 hover:text-dark-text px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <link.icon className="h-5 w-5 mr-2 text-brand-blue" />
                  {link.text}
                </Link>
              ))}
              {isAdmin ? (
                <button onClick={handleLogout} className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors">
                  <LogOut className="h-5 w-5 mr-2" />
                  Sair
                </button>
              ) : (
                <Link to="/admin/login" className="flex items-center text-medium-text hover:bg-gray-100 hover:text-dark-text px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <User className="h-5 w-5 mr-2 text-brand-blue" />
                  Acesso Admin
                </Link>
              )}
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="inline-flex items-center justify-center p-2 rounded-md text-dark-text hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">Abrir menu principal</span>
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-40"
            />
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-brand-blue text-white z-50 p-6 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                  <Link to="/home" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-3">
                      <img src={logoUrl} alt="COMADESMA Logo" className="h-10 w-10" />
                      <span className="text-xl font-bold">42º AGO</span>
                  </Link>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                      <X className="h-8 w-8" />
                  </button>
              </div>

              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center text-sm font-medium p-2.5 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <link.icon className="h-5 w-5 mr-3" />
                    {link.text}
                  </Link>
                ))}
                {isAdmin ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-sm font-medium p-2.5 rounded-lg hover:bg-white/20 transition-colors text-left w-full mt-6"
                  >
                    <LogOut className="h-5 w-5 mr-3 text-red-400" />
                    Sair
                  </button>
                ) : (
                  <Link
                    to="/admin/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center text-sm font-medium p-2.5 rounded-lg hover:bg-white/20 transition-colors mt-6"
                  >
                    <User className="h-5 w-5 mr-3" />
                    Acesso Admin
                  </Link>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
