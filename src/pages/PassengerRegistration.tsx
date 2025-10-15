import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReservation } from '../contexts/ReservationContext';
import { User, FileText, MapPin, Church, Phone, Armchair } from 'lucide-react';
import { SeatType } from '../types';

const PassengerRegistration: React.FC = () => {
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [city, setCity] = useState('');
  const [pastorName, setPastorName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { seatType } = useParams<{ seatType: SeatType }>();
  const { addPassenger, settings } = useReservation();

  if (!seatType || (seatType !== 'leito' && seatType !== 'semi-leito')) {
    navigate('/');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !document.trim() || !city.trim() || !pastorName.trim() || !whatsapp.trim()) {
      setError('Todos os campos são obrigatórios.');
      return;
    }
    const passenger = addPassenger({ name, document, city, pastor_name: pastorName, seatType, whatsapp });
    navigate(`/selecionar-assento/${passenger.id}`);
  };
  
  const price = seatType === 'leito' ? settings?.leito_price : settings?.semi_leito_price;

  return (
    <div className="max-w-md mx-auto mt-10">
       <div className="bg-blue-50 border-l-4 border-brand-blue text-blue-800 p-4 rounded-r-lg mb-6">
        <h3 className="font-bold">Sua Reserva</h3>
        <div className="flex items-center text-sm mt-2">
          <Armchair className="w-4 h-4 mr-2" />
          Poltrona: <span className="font-semibold ml-1">{seatType === 'leito' ? 'Leito' : 'Semi-Leito'}</span>
        </div>
        {price && (
            <div className="flex items-center text-sm mt-1">
                <span className="font-semibold">R$ {price.toFixed(2)}</span>
            </div>
        )}
      </div>
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Cadastro de Passageiro</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <div className="mt-1 relative">
              <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue" required />
            </div>
          </div>
          <div>
            <label htmlFor="document" className="block text-sm font-medium text-gray-700">CPF</label>
            <div className="mt-1 relative">
              <FileText className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" id="document" value={document} onChange={(e) => setDocument(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue" required />
            </div>
          </div>
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">WhatsApp</label>
            <div className="mt-1 relative">
              <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="tel" id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue" required placeholder="(XX) XXXXX-XXXX"/>
            </div>
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">Cidade</label>
            <div className="mt-1 relative">
              <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue" required />
            </div>
          </div>
          <div>
            <label htmlFor="pastorName" className="block text-sm font-medium text-gray-700">Nome do Pastor</label>
            <div className="mt-1 relative">
              <Church className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" id="pastorName" value={pastorName} onChange={(e) => setPastorName(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue" required />
            </div>
          </div>
          <button type="submit" className="w-full bg-brand-yellow hover:bg-yellow-500 text-gray-800 font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center">
            <Armchair className="mr-2 h-5 w-5" />
            Escolher Poltrona
          </button>
        </form>
      </div>
    </div>
  );
};

export default PassengerRegistration;
