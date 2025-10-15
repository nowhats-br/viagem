import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Download, Loader2 } from 'lucide-react';
import { useReservation } from '../contexts/ReservationContext';
import { generatePdf } from '../lib/pdf';
import Ticket from '../components/Ticket';
import { Reservation } from '../types';

const Confirmation: React.FC = () => {
  const { clearReservation } = useReservation();
  const location = useLocation();
  const [reservation, setReservation] = useState<Reservation | null>(location.state?.reservation);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    clearReservation();
  }, [clearReservation]);

  const handleDownloadTicket = async () => {
    if (!reservation) return;
    setIsGeneratingPdf(true);
    try {
      // Assuming one ticket per reservation for simplicity in this example
      await generatePdf(`ticket-${reservation.id}`, `passagem-reserva-${reservation.id}`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Ocorreu um erro ao gerar a passagem. Tente novamente.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Reserva em Processamento!</h2>
      <p className="text-gray-600 mb-8">
        Sua reserva foi recebida e está aguardando a confirmação do pagamento. Você será notificado e poderá gerar sua passagem assim que o pagamento for confirmado.
      </p>
      <div className="space-y-4">
        <Link to="/" className="w-full block bg-brand-blue hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
          Fazer Nova Reserva
        </Link>
        <Link to="/consultar-reserva" className="w-full block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition duration-300">
          Consultar Minhas Reservas
        </Link>
      </div>

      {/* Hidden ticket for PDF generation */}
      {reservation && reservation.status === 'confirmada' && (
         <div className="absolute -left-full">
            <div id={`ticket-${reservation.id}`}>
              <Ticket reservation={reservation} />
            </div>
         </div>
      )}
    </div>
  );
};

export default Confirmation;
