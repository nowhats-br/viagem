import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useReservation } from '../contexts/ReservationContext';

const Confirmation: React.FC = () => {
  const { clearReservation } = useReservation();

  useEffect(() => {
    // Clear reservation from context after a brief moment
    // to ensure any final logic has completed.
    const timer = setTimeout(() => {
        clearReservation();
    }, 500);
    return () => clearTimeout(timer);
  }, [clearReservation]);


  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg text-center">
      <CheckCircle className="w-16 h-16 text-brand-green mx-auto mb-4" />
      <h2 className="text-3xl font-bold text-dark-text mb-4">Reserva em Processamento!</h2>
      <p className="text-medium-text mb-8">
        Sua reserva foi recebida e está aguardando a confirmação do pagamento. Você será notificado e poderá gerar sua passagem assim que o pagamento for confirmado na área de "Consultar Reserva".
      </p>
      <div className="space-y-4">
        <Link to="/home" className="w-full block bg-brand-blue hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
          Fazer Nova Reserva
        </Link>
        <Link to="/consultar-reserva" className="w-full block bg-gray-200 hover:bg-gray-300 text-dark-text font-bold py-3 px-4 rounded-lg transition duration-300">
          Consultar Minhas Reservas
        </Link>
      </div>
    </div>
  );
};

export default Confirmation;
