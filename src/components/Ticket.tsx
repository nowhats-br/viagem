import React from 'react';
import { Reservation } from '../types';
import { Bus, User, QrCode, Calendar, MapPin } from 'lucide-react';

interface TicketProps {
  reservation: Reservation;
  startDate: string;
  endDate: string;
}

const logoUrl = 'https://www.comadesma.com.br/assets/img/logo.png';

const Ticket: React.FC<TicketProps> = ({ reservation, startDate, endDate }) => {
  const passenger = reservation.passengers[0];

  if (!passenger) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return '--/--/----';
    // Add timezone to prevent off-by-one day errors
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white p-4 border-2 border-dashed border-gray-300 rounded-lg w-[320px] font-sans">
      <div className="text-center border-b-2 border-dashed border-gray-300 pb-3 mb-3">
        <img src={logoUrl} alt="COMADESMA Logo" className="h-12 w-12 mx-auto mb-2" />
        <h2 className="text-lg font-bold text-gray-800">COMPROVANTE DE VIAGEM</h2>
        <p className="text-sm font-semibold text-brand-blue">42º AGO COMADESMA</p>
      </div>

      <div className="my-4">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Passageiro(a)</span>
          <span>Poltrona</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <p className="truncate mr-2">{passenger.name}</p>
          <p className="font-mono">{String(passenger.seat_number).padStart(2, '0')}</p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-xs text-gray-500">Tipo de Assento</p>
          <p className="font-bold capitalize">{passenger.seat_type.replace('-', ' ')}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Documento (CPF)</p>
          <p className="font-bold font-mono">{passenger.document}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center text-sm my-4 bg-gray-50 p-3 rounded-md">
        <div>
          <p className="font-bold text-gray-700 flex items-center justify-center gap-1"><Calendar size={14}/> EMBARQUE</p>
          <p className="font-mono">{formatDate(startDate)}</p>
        </div>
        <div>
          <p className="font-bold text-gray-700 flex items-center justify-center gap-1"><Calendar size={14}/> RETORNO</p>
          <p className="font-mono">{formatDate(endDate)}</p>
        </div>
      </div>

       <div className="text-center text-sm">
           <p className="font-bold text-gray-700 flex items-center justify-center gap-1"><MapPin size={14}/> DESTINO</p>
           <p>Açailândia, Maranhão</p>
       </div>

      <div className="border-t-2 border-dashed border-gray-300 pt-3 mt-3 flex flex-col items-center justify-center">
        <QrCode className="h-20 w-20 text-gray-700" />
        <p className="text-[10px] text-gray-500 mt-1 font-mono">Reserva #{String(reservation.id).padStart(6, '0')}</p>
      </div>
       <p className="text-center text-xs text-gray-500 mt-2">Boa Viagem!</p>
    </div>
  );
};

export default Ticket;
