import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReservation } from '../contexts/ReservationContext';
import { User, FileText, MapPin, Church, Phone, Armchair, ArrowRight } from 'lucide-react';
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
    navigate('/home');
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
    <div className="max-w-lg mx-auto mt-10">
       <div className="bg-brand-blue/10 border-l-4 border-brand-blue text-dark-text p-4 rounded-r-lg mb-8 shadow-sm">
        <h3 className="font-bold text-lg">Detalhes da sua Reserva</h3>
        <div className="flex items-center text-base mt-2">
          <Armchair className="w-5 h-5 mr-3 text-brand-blue" />
          Tipo de Poltrona: <span className="font-semibold ml-1.5">{seatType === 'leito' ? 'Leito' : 'Semi-Leito'}</span>
        </div>
        {price && (
            <div className="flex items-center text-base mt-1 font-semibold">
                Valor: R$ {price.toFixed(2)}
            </div>
        )}
      </div>
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-dark-text mb-8">Cadastro do Passageiro</h2>
        {error && <p className="text-red-500 text-center text-sm mb-4 bg-red-100 p-3 rounded-md">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="relative group">
            <label htmlFor="name" className="absolute -top-2.5 left-2.5 bg-white px-1 text-sm text-medium-text group-focus-within:text-brand-blue transition-colors">Nome Completo</label>
            <div className="flex items-center border-2 border-gray-300 rounded-lg focus-within:border-brand-blue transition-colors">
              <User className="h-5 w-5 text-gray-400 mx-3" />
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full py-3 pr-3 bg-transparent focus:outline-none focus:bg-blue-50/50" required />
            </div>
          </div>

          <div className="relative group">
            <label htmlFor="document" className="absolute -top-2.5 left-2.5 bg-white px-1 text-sm text-medium-text group-focus-within:text-brand-blue transition-colors">CPF</label>
            <div className="flex items-center border-2 border-gray-300 rounded-lg focus-within:border-brand-blue transition-colors">
              <FileText className="h-5 w-5 text-gray-400 mx-3" />
              <input type="text" id="document" value={document} onChange={(e) => setDocument(e.target.value)} className="w-full py-3 pr-3 bg-transparent focus:outline-none focus:bg-blue-50/50" required placeholder="000.000.000-00"/>
            </div>
          </div>

          <div className="relative group">
            <label htmlFor="whatsapp" className="absolute -top-2.5 left-2.5 bg-white px-1 text-sm text-medium-text group-focus-within:text-brand-blue transition-colors">WhatsApp</label>
            <div className="flex items-center border-2 border-gray-300 rounded-lg focus-within:border-brand-blue transition-colors">
              <Phone className="h-5 w-5 text-gray-400 mx-3" />
              <input type="tel" id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full py-3 pr-3 bg-transparent focus:outline-none focus:bg-blue-50/50" required placeholder="(99) 99999-9999"/>
            </div>
          </div>

          <div className="relative group">
            <label htmlFor="city" className="absolute -top-2.5 left-2.5 bg-white px-1 text-sm text-medium-text group-focus-within:text-brand-blue transition-colors">Cidade de Origem</label>
            <div className="flex items-center border-2 border-gray-300 rounded-lg focus-within:border-brand-blue transition-colors">
              <MapPin className="h-5 w-5 text-gray-400 mx-3" />
              <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} className="w-full py-3 pr-3 bg-transparent focus:outline-none focus:bg-blue-50/50" required />
            </div>
          </div>

          <div className="relative group">
            <label htmlFor="pastorName" className="absolute -top-2.5 left-2.5 bg-white px-1 text-sm text-medium-text group-focus-within:text-brand-blue transition-colors">Nome do Pastor</label>
            <div className="flex items-center border-2 border-gray-300 rounded-lg focus-within:border-brand-blue transition-colors">
              <Church className="h-5 w-5 text-gray-400 mx-3" />
              <input type="text" id="pastorName" value={pastorName} onChange={(e) => setPastorName(e.target.value)} className="w-full py-3 pr-3 bg-transparent focus:outline-none focus:bg-blue-50/50" required />
            </div>
          </div>

          <button type="submit" className="w-full bg-brand-yellow hover:bg-yellow-500 text-dark-text font-bold py-4 px-4 rounded-lg transition duration-300 flex items-center justify-center text-lg transform hover:scale-105">
            Escolher Poltrona
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default PassengerRegistration;
