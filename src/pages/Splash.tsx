import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// URL da imagem do ônibus, conforme solicitado.
const busImageUrl = 'https://i.imgur.com/R21A42B.jpg'; 

const Splash: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 4000); // Duração de 4 segundos para a tela de abertura

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center text-white relative"
      style={{ backgroundImage: `url(${busImageUrl})` }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="relative z-10 text-center p-4">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold tracking-wider text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'backOut' }}
          style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}
        >
          42º AGO COMADESMA
        </motion.h1>
         <motion.p 
          className="mt-4 text-xl font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}
        >
          Carregando sistema de reservas...
        </motion.p>
      </div>
    </div>
  );
};

export default Splash;
