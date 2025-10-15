import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservation } from '../contexts/ReservationContext';
import { QrCode, User, Loader2, CreditCard } from 'lucide-react';
import { Payment as PaymentType } from '../types';

const Payment: React.FC = () => {
  const { passengers, completeReservation, settings } = useReservation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<PaymentType['method']>('pix');
  const [installments, setInstallments] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  if (passengers.length === 0 || !settings) {
    navigate('/');
    return null;
  }

  const totalAmount = passengers.reduce((total, p) => {
    const price = p.seatType === 'leito' ? settings.leito_price : settings.semi_leito_price;
    return total + price;
  }, 0);

  const maxInstallments = paymentMethod === 'pix' ? 3 : 12;

  const handleCompleteReservation = async () => {
    setIsProcessing(true);
    try {
      await completeReservation({ method: paymentMethod, installments });
      navigate('/confirmacao');
    } catch (error) {
      alert((error as Error).message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Pagamento</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Resumo da Reserva</h3>
          {passengers.map(p => (
            <div key={p.id} className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3 text-gray-500" />
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-gray-500">{p.seatType === 'leito' ? 'Leito' : 'Semi-Leito'} - Poltrona {p.seatNumber}</p>
                </div>
              </div>
              <p className="font-semibold">R$ {(p.seatType === 'leito' ? settings.leito_price : settings.semi_leito_price).toFixed(2)}</p>
            </div>
          ))}
          <div className="flex justify-between items-center mt-4 pt-4 border-t-2 font-bold text-lg">
            <p>Total</p>
            <p>R$ {totalAmount.toFixed(2)}</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Forma de pagamento</h3>
          <div className="flex space-x-4 mb-6">
            <button onClick={() => { setPaymentMethod('pix'); setInstallments(1); }} className={`flex-1 p-4 rounded-lg border-2 flex items-center justify-center gap-2 ${paymentMethod === 'pix' ? 'border-brand-blue bg-blue-50' : 'border-gray-300'}`}>
              <QrCode /> PIX
            </button>
            <button onClick={() => { setPaymentMethod('credit_card'); setInstallments(1); }} className={`flex-1 p-4 rounded-lg border-2 flex items-center justify-center gap-2 ${paymentMethod === 'credit_card' ? 'border-brand-blue bg-blue-50' : 'border-gray-300'}`}>
              <CreditCard /> Cartão
            </button>
          </div>

          {paymentMethod === 'pix' ? (
            <div className="bg-blue-50 p-4 rounded-lg flex items-center">
              <QrCode className="w-8 h-8 text-brand-blue mr-4" />
              <p className="text-blue-800">Após a confirmação, você receberá as instruções para o pagamento via PIX.</p>
            </div>
          ) : (
             <div className="bg-blue-50 p-4 rounded-lg flex items-center">
                <CreditCard className="w-8 h-8 text-brand-blue mr-4" />
                <p className="text-blue-800">Pagamento com cartão de crédito selecionado. Escolha o número de parcelas.</p>
             </div>
          )}

          <div className="mt-6">
            <label htmlFor="installments" className="block text-sm font-medium text-gray-700">Parcelas</label>
            <select id="installments" value={installments} onChange={e => setInstallments(Number(e.target.value))} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm">
              {Array.from({ length: maxInstallments }, (_, i) => i + 1).map(i => (
                <option key={i} value={i}>{i}x de R$ {(totalAmount / i).toFixed(2)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button onClick={handleCompleteReservation} disabled={isProcessing} className="w-full md:w-1/2 bg-brand-yellow hover:bg-yellow-500 text-gray-800 font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed">
          {isProcessing ? <Loader2 className="animate-spin mr-2" /> : null}
          {isProcessing ? 'Processando...' : 'Finalizar Reserva'}
        </button>
      </div>
    </div>
  );
};

export default Payment;
