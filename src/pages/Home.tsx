import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sofa, Armchair, Calendar, Map, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-brand-blue">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-blue mb-3">Convenção Comadesma</h1>
            <p className="text-2xl font-semibold text-gray-700">Janeiro de 2026</p>
            <div className="mt-6 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-gray-600">
                <div className="flex items-center gap-2">
                    <Map className="w-5 h-5 text-brand-blue" />
                    <span>Imperatriz, Maranhão</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-brand-blue" />
                    <span><span className="font-semibold">06/01</span> a <span className="font-semibold">10/01/2026</span></span>
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
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Inicie sua Reserva</h2>
        <p className="text-lg text-gray-500 mb-10">Escolha o tipo de poltrona para garantir seu lugar.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Leito Card */}
          <motion.div variants={cardVariants}>
            <button 
              onClick={() => navigate('/nova-reserva/leito')}
              className="w-full h-full text-left group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
            >
              <Sofa className="w-16 h-16 text-brand-blue mb-4" />
              <h3 className="text-2xl font-bold text-gray-800">Poltrona Leito</h3>
              <p className="text-gray-600 mt-2">Conforto máximo com reclinação total e mais espaço. Ideal para uma viagem relaxante.</p>
              <p className="text-sm font-semibold text-gray-500 mt-3">(12 Lugares)</p>
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
              className="w-full h-full text-left group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2"
            >
              <Armchair className="w-16 h-16 text-brand-yellow mb-4" />
              <h3 className="text-2xl font-bold text-gray-800">Poltrona Semi-Leito</h3>
              <p className="text-gray-600 mt-2">Excelente custo-benefício com conforto garantido para sua viagem.</p>
              <p className="text-sm font-semibold text-gray-500 mt-3">(44 Lugares)</p>
              <div className="mt-6">
                <span className="inline-block bg-brand-yellow text-gray-800 font-bold py-3 px-6 rounded-lg group-hover:bg-yellow-500 transition-colors">
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
