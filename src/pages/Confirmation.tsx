import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const Confirmation: React.FC = () => {
  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Reserva Concluída!</h2>
      <p className="text-gray-600 mb-8">
        Sua reserva foi efetuada com sucesso. Em breve você receberá os detalhes por e-mail.
        Lembre-se que a reserva não será perdida.
      </p>
      <div className="space-y-4">
        <Link to="/" className="w-full block bg-brand-purple hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
          Fazer Nova Reserva
        </Link>
        <Link to="/admin" className="w-full block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition duration-300">
          Ver Painel do Admin
        </Link>
      </div>
    </div>
  );
};

export default Confirmation;
