import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservation } from '../contexts/ReservationContext';
import { SeatType } from '../types';
import { User, FileText, Armchair } from 'lucide-react';

const PassengerRegistration: React.FC = () => {
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [seatType, setSeatType] = useState<SeatType>('semi-leito');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addPassenger } = useReservation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !document.trim()) {
      setError('Nome e documento são obrigatórios.');
      return;
    }
    const passenger = addPassenger(name, document, seatType);
    navigate(`/selecionar-assento/${passenger.id}`);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Cadastro de Passageiro</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm"
              placeholder="João da Silva"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="document" className="block text-sm font-medium text-gray-700">Documento (CPF)</label>
          <div className="mt-1 relative rounded-md shadow-sm">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="document"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm"
              placeholder="123.456.789-00"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Poltrona</label>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div onClick={() => setSeatType('semi-leito')} className={`cursor-pointer p-4 border rounded-lg flex flex-col items-center justify-center transition-all ${seatType === 'semi-leito' ? 'bg-brand-purple text-white ring-2 ring-brand-purple' : 'bg-gray-50 hover:bg-gray-100'}`}>
              <Armchair className="h-8 w-8 mb-2"/>
              <span className="font-semibold">Semi-Leito</span>
              <span className="text-xs">R$ 119,99</span>
            </div>
            <div onClick={() => setSeatType('leito')} className={`cursor-pointer p-4 border rounded-lg flex flex-col items-center justify-center transition-all ${seatType === 'leito' ? 'bg-brand-purple text-white ring-2 ring-brand-purple' : 'bg-gray-50 hover:bg-gray-100'}`}>
              <Armchair className="h-8 w-8 mb-2"/>
              <span className="font-semibold">Leito</span>
              <span className="text-xs">R$ 189,99</span>
            </div>
          </div>
        </div>
        <button type="submit" className="w-full bg-brand-yellow hover:bg-yellow-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
          Escolher Poltrona
        </button>
      </form>
    </div>
  );
};

export default PassengerRegistration;
