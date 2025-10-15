import React from 'react';
import { Reservation } from '../types';
import { Bus, User, Armchair, Calendar, QrCode } from 'lucide-react';

interface TicketProps {
  reservation: Reservation;
}

const Ticket: React.FC<TicketProps> = ({ reservation }) => {
  const passenger = reservation.passengers[0]; // Assuming one passenger per ticket for now

  if (!passenger) return null;

  return (
    <div className="bg-white p-4 border-2 border-gray-200 rounded-lg w-[302px]">
      <div className="text-center border-b-2 border-dashed border-gray-300 pb-2 mb-2">
        <Bus className="mx-auto h-8 w-8 text-brand-blue" />
        <h2 className="text-xl font-bold text-gray-800">Excursão Comadesma</h2>
        <p className="text-sm font-semibold">Janeiro 2026</p>
      </div>

      <div className="my-3">
        <div className="flex justify-between text-xs">
          <p className="text-gray-500">Passageiro</p>
          <p className="text-gray-500">Poltrona</p>
        </div>
        <div className="flex justify-between font-bold">
          <p className="truncate">{passenger.name}</p>
          <p>{passenger.seat_number}</p>
        </div>
      </div>

      <div className="my-3">
        <p className="text-xs text-gray-500">Tipo</p>
        <p className="font-bold capitalize">{passenger.seat_type.replace('-', ' ')}</p>
      </div>

      <div className="my-3">
        <p className="text-xs text-gray-500">Documento (CPF)</p>
        <p className="font-bold">{passenger.document}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center text-xs my-4">
        <div>
          <p className="font-bold">Saída</p>
          <p>06/01/2026</p>
        </div>
        <div>
          <p className="font-bold">Retorno</p>
          <p>10/01/2026</p>
        </div>
      </div>

      <div className="border-t-2 border-dashed border-gray-300 pt-2 mt-2 flex items-center justify-center">
        <QrCode className="h-16 w-16" />
      </div>
       <p className="text-center text-xs text-gray-500 mt-2">Boa Viagem!</p>
    </div>
  );
};

export default Ticket;
