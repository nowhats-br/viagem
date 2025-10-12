import React from 'react';
import { useReservation } from '../contexts/ReservationContext';
import { User, CreditCard, Check, Armchair } from 'lucide-react';

const Admin: React.FC = () => {
  const { reservations, markInstallmentAsPaid } = useReservation();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Painel Administrativo</h1>

      {reservations.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">Nenhuma reserva encontrada.</p>
      ) : (
        <div className="space-y-6">
          {reservations.map(reservation => (
            <div key={reservation.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-wrap justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">Reserva #{reservation.id.substring(0, 8)}</h2>
                  <p className="text-gray-600">Total: <span className="font-semibold">R$ {reservation.totalAmount.toFixed(2)}</span></p>
                </div>
                <div className="text-sm text-gray-500 mt-2 md:mt-0">
                  <p>Pagamento: {reservation.payment?.method === 'pix' ? 'PIX' : 'Cartão de Crédito'}</p>
                  <p>Parcelas: {reservation.paidInstallments} / {reservation.payment?.installments}</p>
                </div>
              </div>

              <h3 className="font-semibold mb-2 mt-4">Passageiros:</h3>
              <div className="space-y-2">
                {reservation.passengers.map(passenger => (
                  <div key={passenger.id} className="flex items-center bg-gray-50 p-3 rounded-md">
                    <User className="w-5 h-5 mr-3 text-gray-500" />
                    <div className="flex-grow">
                      <p className="font-medium">{passenger.name}</p>
                      <p className="text-sm text-gray-500">Doc: {passenger.document}</p>
                    </div>
                    <div className="flex items-center text-sm">
                      <Armchair className="w-4 h-4 mr-1 text-gray-500" />
                      {passenger.seatType} - {passenger.seatNumber}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Controle de Parcelas</h3>
                {reservation.payment && reservation.paidInstallments < reservation.payment.installments ? (
                  <button
                    onClick={() => markInstallmentAsPaid(reservation.id)}
                    className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Marcar Parcela Como Paga ({reservation.paidInstallments + 1}/{reservation.payment.installments})
                  </button>
                ) : (
                  <div className="flex items-center text-green-600 font-semibold bg-green-100 p-3 rounded-lg">
                    <Check className="w-5 h-5 mr-2" />
                    Pagamento Concluído!
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
