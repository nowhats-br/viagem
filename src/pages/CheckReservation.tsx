import React, { useState } from 'react';
import { findReservationsByCPF } from '../lib/supabase';
import { Reservation } from '../types';
import { Loader2, Search, User, Armchair, Frown, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { generatePdf } from '../lib/pdf';
import Ticket from '../components/Ticket';

const CheckReservation: React.FC = () => {
  const [cpf, setCpf] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<number | null>(null);

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

  const handleDownloadTicket = async (reservation: Reservation) => {
    setIsGeneratingPdf(reservation.id);
    try {
      await generatePdf(`ticket-${reservation.id}`, `passagem-reserva-${reservation.id}`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Ocorreu um erro ao gerar a passagem. Tente novamente.");
    } finally {
      setIsGeneratingPdf(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Consultar Reserva</h2>
        <p className="text-center text-gray-500 mb-8">Digite seu CPF para encontrar suas reservas.</p>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className="flex-grow block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
            placeholder="123.456.789-00"
            required
          />
          <button type="submit" disabled={loading} className="bg-brand-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center disabled:bg-blue-300">
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
              <p className="text-gray-500">Não encontramos reservas para o CPF informado.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reservations.map(reservation => (
                <div key={reservation.id} className="bg-white p-6 rounded-lg shadow-md">
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
                        <span className="flex items-center text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full text-sm">
                          <CheckCircle className="w-4 h-4 mr-2" /> Reserva Confirmada
                        </span>
                      )}
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
                          {passenger.seat_type} - {passenger.seat_number}
                        </div>
                      </div>
                    ))}
                  </div>
                  {reservation.status === 'confirmada' && (
                    <div className="mt-6">
                      <button onClick={() => handleDownloadTicket(reservation)} disabled={isGeneratingPdf === reservation.id} className="w-full bg-brand-yellow hover:bg-yellow-500 text-gray-800 font-bold py-2 px-4 rounded-lg flex items-center justify-center disabled:opacity-50">
                        {isGeneratingPdf === reservation.id ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Download className="w-5 h-5 mr-2" />}
                        {isGeneratingPdf === reservation.id ? 'Gerando...' : 'Baixar Passagem (PDF)'}
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
      <div className="absolute -left-full top-0">
        {reservations.map(res => (
          <div key={`ticket-container-${res.id}`} id={`ticket-${res.id}`}>
            <Ticket reservation={res} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckReservation;
