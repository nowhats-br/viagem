import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sofa, Armchair, Calendar, Map, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center text-center p-4">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-12 w-full max-w-4xl"
      >
        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-8 border-brand-blue">
            <h1 className="text-4xl md:text-5xl font-extrabold text-dark-text mb-4">42º AGO COMADESMA</h1>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-medium-text">
                <div className="flex items-center gap-2 text-lg">
                    <Map className="w-5 h-5 text-brand-yellow" />
                    <span>Açailândia, Maranhão</span>
                </div>
                <div className="flex items-center gap-2 text-lg">
                    <Calendar className="w-5 h-5 text-brand-yellow" />
                    <span><span className="font-semibold">06 a 10 de Janeiro</span> de 2026</span>
                </div>
            </div>
        </div>
      </motion.div>

      {/* Selection Section */}
      <motion.div 
        className="w-full max-w-4xl"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      >
        <h2 className="text-3xl font-bold text-dark-text mb-4">Faça sua Reserva</h2>
        <p className="text-lg text-medium-text mb-10">Escolha o tipo de poltrona para garantir seu lugar na caravana.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Leito Card */}
          <motion.div variants={cardVariants}>
            <button 
              onClick={() => navigate('/nova-reserva/leito')}
              className="w-full h-full text-left group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/30"
            >
              <Sofa className="w-16 h-16 text-brand-blue mb-4" />
              <h3 className="text-2xl font-bold text-dark-text">Poltrona Leito</h3>
              <p className="text-medium-text mt-2">Conforto máximo com reclinação total e mais espaço. Ideal para uma viagem relaxante.</p>
              <p className="text-sm font-semibold text-medium-text mt-3">(12 Lugares)</p>
              <div className="mt-6">
                <span className="inline-block bg-brand-blue text-white font-bold py-3 px-6 rounded-lg group-hover:bg-blue-700 transition-colors">
                  Reservar Leito
                </span>
              </div>
            </button>
          </motion.div>

          {/* Semi-Leito Card */}
          <motion.div variants={cardVariants}>
            <button 
              onClick={() => navigate('/nova-reserva/semi-leito')}
              className="w-full h-full text-left group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-brand-yellow focus:outline-none focus:ring-4 focus:ring-brand-yellow/30"
            >
              <Armchair className="w-16 h-16 text-brand-yellow mb-4" />
              <h3 className="text-2xl font-bold text-dark-text">Poltrona Semi-Leito</h3>
              <p className="text-medium-text mt-2">Excelente custo-benefício com conforto garantido para sua viagem.</p>
              <p className="text-sm font-semibold text-medium-text mt-3">(44 Lugares)</p>
              <div className="mt-6">
                <span className="inline-block bg-brand-yellow text-dark-text font-bold py-3 px-6 rounded-lg group-hover:bg-yellow-500 transition-colors">
                  Reservar Semi-Leito
                </span>
              </div>
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Check Reservation Link */}
      <motion.div 
        className="mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <button 
          onClick={() => navigate('/consultar-reserva')}
          className="flex items-center gap-2 text-brand-blue hover:underline font-semibold"
        >
          <Search className="w-5 h-5" />
          Já tem uma reserva? Consulte aqui.
        </button>
      </motion.div>
    </div>
  );
};

export default Home;
