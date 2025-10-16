import React, { useState, useEffect } from 'react';
import { findReservationsByCPF, getExcursionSettings } from '../lib/supabase';
import { Reservation, ExcursionSettings } from '../types';
import { Loader2, Search, User, Armchair, Frown, Download, CheckCircle, AlertCircle, Share2, Phone } from 'lucide-react';
import { downloadPdf } from '../lib/pdf';
import { shareTicket } from '../lib/share';
import Ticket from '../components/Ticket';

const CheckReservation: React.FC = () => {
  const [cpf, setCpf] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [settings, setSettings] = useState<ExcursionSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getExcursionSettings();
        setSettings(data);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await findReservationsByCPF(cpf);
      setReservations(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: 'download' | 'share', reservation: Reservation) => {
    if (!settings || !settings.start_date || !settings.end_date) {
      alert("As configurações da excursão não foram carregadas ou estão incompletas. Tente novamente ou contate o suporte.");
      return;
    }
    setIsProcessing(reservation.id);
    const ticketElementId = `ticket-${reservation.id}`;
    try {
      if (action === 'download') {
        await downloadPdf(ticketElementId, `passagem-reserva-${reservation.id}`);
      } else {
        await shareTicket(reservation, settings, ticketElementId);
      }
    } catch (error) {
      console.error(`Failed to ${action} ticket:`, error);
      alert(`Ocorreu um erro ao ${action === 'download' ? 'baixar' : 'compartilhar'} a passagem.`);
    } finally {
      setIsProcessing(null);
    }
  };


  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-dark-text mb-6">Consultar Reserva</h2>
        <p className="text-center text-medium-text mb-8">Digite seu CPF para encontrar suas reservas.</p>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className="flex-grow block w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors"
            placeholder="123.456.789-00"
            required
          />
          <button type="submit" disabled={loading} className="bg-brand-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center w-16 disabled:bg-blue-300">
            {loading ? <Loader2 className="animate-spin" /> : <Search />}
          </button>
        </form>
      </div>

      {loading && <div className="text-center mt-8"><Loader2 className="w-8 h-8 animate-spin text-brand-blue mx-auto" /></div>}
      {error && <p className="text-center text-red-500 mt-8">{error}</p>}

      {searched && !loading && !error && (
        <div className="mt-8">
          {reservations.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <Frown className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold">Nenhuma reserva encontrada</h3>
              <p className="text-medium-text">Não encontramos reservas para o CPF informado.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reservations.map(reservation => (
                <div key={reservation.id} className={`bg-white p-6 rounded-lg shadow-lg border-l-4 ${reservation.status === 'confirmada' ? 'border-brand-green' : 'border-orange-500'}`}>
                  <div className="flex flex-wrap justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold">Reserva #{String(reservation.id).padStart(6, '0')}</h2>
                      <p className="text-xs text-gray-400">Data: {new Date(reservation.created_at).toLocaleString('pt-BR')}</p>
                    </div>
                     <div className="text-right">
                      {reservation.status === 'pendente' ? (
                        <span className="flex items-center text-orange-600 font-semibold bg-orange-100 px-3 py-1 rounded-full text-sm">
                          <AlertCircle className="w-4 h-4 mr-2" /> Pagamento Pendente
                        </span>
                      ) : (
                        <span className="flex items-center text-brand-green font-semibold bg-brand-green/10 px-3 py-1 rounded-full text-sm">
                          <CheckCircle className="w-4 h-4 mr-2" /> Reserva Confirmada
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2 mt-4">Passageiros:</h3>
                  <div className="space-y-2">
                    {reservation.passengers.map(passenger => (
                      <div key={passenger.id} className="flex flex-wrap items-center bg-gray-50 p-3 rounded-md gap-x-4 gap-y-2">
                        <div className="flex items-center flex-grow min-w-[150px]">
                          <User className="w-5 h-5 mr-3 text-gray-500" />
                          <div>
                            <p className="font-medium">{passenger.name}</p>
                            <p className="text-sm text-gray-500">Doc: {passenger.document}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-sm font-medium">
                          <Armchair className="w-4 h-4 mr-2 text-gray-500" />
                          {passenger.seat_type.replace('-',' ')} - Poltrona {passenger.seat_number}
                        </div>
                      </div>
                    ))}
                  </div>
                  {reservation.status === 'confirmada' && (
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <button onClick={() => handleAction('share', reservation)} disabled={isProcessing === reservation.id} className="w-full flex-1 bg-brand-green hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center disabled:opacity-50 transition-all transform hover:scale-105">
                        {isProcessing === reservation.id ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Share2 className="w-5 h-5 mr-2" />}
                        {isProcessing === reservation.id ? 'Aguarde...' : 'Compartilhar'}
                      </button>
                      <button onClick={() => handleAction('download', reservation)} disabled={isProcessing === reservation.id} className="w-full flex-1 bg-brand-yellow hover:bg-yellow-500 text-dark-text font-bold py-3 px-4 rounded-lg flex items-center justify-center disabled:opacity-50 transition-all transform hover:scale-105">
                        {isProcessing === reservation.id ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Download className="w-5 h-5 mr-2" />}
                        {isProcessing === reservation.id ? 'Gerando...' : 'Baixar Passagem'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hidden tickets for PDF generation */}
      <div className="absolute -left-full top-0 opacity-0 -z-10">
        {reservations.map(res => (
          <div key={`ticket-container-${res.id}`} id={`ticket-${res.id}`}>
            {settings && settings.start_date && settings.end_date && <Ticket reservation={res} startDate={settings.start_date} endDate={settings.end_date} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckReservation;
