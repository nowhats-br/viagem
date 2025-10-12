import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservation } from '../contexts/ReservationContext';
import { CreditCard, QrCode, User } from 'lucide-react';

const Payment: React.FC = () => {
  const { passengers, completeReservation } = useReservation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit-card'>('credit-card');
  const [installments, setInstallments] = useState(1);

  if (passengers.length === 0) {
    navigate('/');
    return null;
  }

  const seatType = passengers[0].seatType;
  const pricePerPassenger = seatType === 'leito' ? 189.99 : 119.99;
  const totalAmount = passengers.length * pricePerPassenger;

  const handleCompleteReservation = () => {
    completeReservation({
      method: paymentMethod,
      installments: paymentMethod === 'pix' ? 3 : installments,
    });
    navigate('/confirmacao');
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Pagamento</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Resumo do Pedido</h3>
          {passengers.map(p => (
            <div key={p.id} className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3 text-gray-500" />
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-gray-500">{seatType} - Poltrona {p.seatNumber}</p>
                </div>
              </div>
              <p className="font-semibold">R$ {pricePerPassenger.toFixed(2)}</p>
            </div>
          ))}
          <div className="flex justify-between items-center mt-4 pt-4 border-t-2 font-bold text-lg">
            <p>Total</p>
            <p>R$ {totalAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Payment Options */}
        <div>
          <h3 className="text-xl font-bold mb-4">Escolha a forma de pagamento</h3>
          <div className="flex space-x-4 mb-6">
            <button onClick={() => setPaymentMethod('credit-card')} className={`flex-1 p-4 border rounded-lg flex items-center justify-center transition-all ${paymentMethod === 'credit-card' ? 'bg-brand-purple text-white' : 'hover:bg-gray-100'}`}>
              <CreditCard className="mr-2" /> Cartão de Crédito
            </button>
            <button onClick={() => setPaymentMethod('pix')} className={`flex-1 p-4 border rounded-lg flex items-center justify-center transition-all ${paymentMethod === 'pix' ? 'bg-brand-purple text-white' : 'hover:bg-gray-100'}`}>
              <QrCode className="mr-2" /> PIX
            </button>
          </div>

          {paymentMethod === 'credit-card' && (
            <div>
              <label htmlFor="installments" className="block text-sm font-medium text-gray-700">Parcelas no Cartão de Crédito</label>
              <select id="installments" value={installments} onChange={e => setInstallments(Number(e.target.value))} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(i => (
                  <option key={i} value={i}>{i}x de R$ {(totalAmount / i).toFixed(2)}</option>
                ))}
              </select>
            </div>
          )}

          {paymentMethod === 'pix' && (
            <div>
              <label htmlFor="pix-installments" className="block text-sm font-medium text-gray-700">Parcelas no PIX</label>
              <select id="pix-installments" value={installments} onChange={e => setInstallments(Number(e.target.value))} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm">
                 {Array.from({ length: 3 }, (_, i) => i + 1).map(i => (
                  <option key={i} value={i}>{i}x de R$ {(totalAmount / i).toFixed(2)}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <button onClick={handleCompleteReservation} className="w-full md:w-1/2 bg-brand-yellow hover:bg-yellow-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105">
          Concluir Reserva
        </button>
      </div>
    </div>
  );
};

export default Payment;
