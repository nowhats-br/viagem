import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Reservation, ExcursionSettings } from '../types';
import { User, CreditCard, Check, Armchair, Loader2, Save, DollarSign, LogOut, Phone, AlertCircle, Share2, Download, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { downloadPdf } from '../lib/pdf';
import { shareTicket } from '../lib/share';
import Ticket from '../components/Ticket';

const Admin: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [settings, setSettings] = useState<Partial<ExcursionSettings>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const reservationsPromise = supabase
        .from('reservations')
        .select(`*, passengers (*)`)
        .order('created_at', { ascending: false });
      
      const settingsPromise = supabase
        .from('excursion_settings')
        .select('*')
        .limit(1)
        .single();

      const [reservationsRes, settingsRes] = await Promise.all([reservationsPromise, settingsPromise]);

      if (reservationsRes.error) throw reservationsRes.error;
      setReservations(reservationsRes.data as Reservation[]);

      if (settingsRes.error) throw settingsRes.error;
      setSettings(settingsRes.data || { leito_price: 0, semi_leito_price: 0 });

    } catch (err: any) {
      console.error('Error fetching admin data:', err);
      setError('Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleMarkAsPaid = async (reservation: Reservation) => {
    if (reservation.paid_installments >= reservation.installments) return;

    const isFirstPayment = reservation.paid_installments === 0;
    const newPaidCount = reservation.paid_installments + 1;
    
    let updatePayload: { paid_installments: number; status?: 'confirmada' } = {
        paid_installments: newPaidCount,
    };
    
    if (isFirstPayment) {
        updatePayload.status = 'confirmada';
    }

    const { error } = await supabase
      .from('reservations')
      .update(updatePayload)
      .eq('id', reservation.id);

    if (error) alert('Erro ao atualizar o pagamento.');
    else fetchAllData();
  };

  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (settings.leito_price === undefined || settings.semi_leito_price === undefined) return;
    
    const { error } = await supabase
        .from('excursion_settings')
        .update({ 
            leito_price: settings.leito_price, 
            semi_leito_price: settings.semi_leito_price,
            start_date: settings.start_date,
            end_date: settings.end_date
        })
        .eq('id', 1);

    if (error) alert('Erro ao salvar configurações.');
    else alert('Configurações atualizadas com sucesso!');
  };

  const handleAction = async (action: 'download' | 'share', reservation: Reservation) => {
    if (!settings.start_date || !settings.end_date) {
      alert("As datas da excursão não estão configuradas. Por favor, salve as datas de início e fim nas configurações.");
      return;
    }
    setIsProcessing(reservation.id);
    const ticketElementId = `ticket-admin-${reservation.id}`;
    try {
      if (action === 'download') {
        await downloadPdf(ticketElementId, `passagem-reserva-${reservation.id}`);
      } else {
        await shareTicket(reservation, settings as ExcursionSettings, ticketElementId);
      }
    } catch (err) {
      console.error(`Failed to ${action} ticket:`, err);
      alert(`Ocorreu um erro ao ${action === 'download' ? 'baixar' : 'compartilhar'} a passagem.`);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return <div className="flex justify-center items-center mt-20"><Loader2 className="w-12 h-12 animate-spin text-brand-blue" /></div>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center">
            <LogOut className="w-5 h-5 mr-2" /> Sair
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-xl mb-8 border-t-4 border-brand-blue">
        <h2 className="text-2xl font-bold mb-4">Configurações da Excursão</h2>
        <form onSubmit={handleSettingsSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* Prices */}
          <div>
            <label htmlFor="leito_price" className="block text-sm font-medium text-gray-700">Preço Leito</label>
            <div className="relative mt-1">
              <DollarSign className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="number" step="0.01" id="leito_price" value={settings.leito_price || ''} onChange={e => setSettings({...settings, leito_price: parseFloat(e.target.value)})} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition" required />
            </div>
          </div>
          <div>
            <label htmlFor="semi_leito_price" className="block text-sm font-medium text-gray-700">Preço Semi-Leito</label>
            <div className="relative mt-1">
              <DollarSign className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="number" step="0.01" id="semi_leito_price" value={settings.semi_leito_price || ''} onChange={e => setSettings({...settings, semi_leito_price: parseFloat(e.target.value)})} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition" required />
            </div>
          </div>
          {/* Dates */}
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Data de Início</label>
            <input type="date" id="start_date" value={settings.start_date || ''} onChange={e => setSettings({...settings, start_date: e.target.value})} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition" required />
          </div>
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">Data de Fim</label>
            <input type="date" id="end_date" value={settings.end_date || ''} onChange={e => setSettings({...settings, end_date: e.target.value})} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition" required />
          </div>
          <button type="submit" className="bg-brand-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center h-10">
            <Save className="w-5 h-5 mr-2" /> Salvar
          </button>
        </form>
      </div>

      <h2 className="text-2xl font-bold mb-4">Reservas Realizadas</h2>
      {reservations.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">Nenhuma reserva encontrada.</p>
      ) : (
        <div className="space-y-6">
          {reservations.map(reservation => (
            <div key={reservation.id} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex flex-wrap justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">Reserva #{String(reservation.id).padStart(6, '0')}</h3>
                  <p className="text-gray-600">Total: <span className="font-semibold">R$ {reservation.total_amount.toFixed(2)}</span></p>
                  <p className="text-xs text-gray-400">Data: {new Date(reservation.created_at).toLocaleString('pt-BR')}</p>
                </div>
                <div className="text-right">
                  {reservation.status === 'pendente' ? (
                    <span className="flex items-center text-orange-600 font-semibold bg-orange-100 px-3 py-1 rounded-full text-sm">
                      <AlertCircle className="w-4 h-4 mr-2" /> Pagamento Pendente
                    </span>
                  ) : (
                    <span className="flex items-center text-brand-green font-semibold bg-green-100 px-3 py-1 rounded-full text-sm">
                      <CheckCircle className="w-4 h-4 mr-2" /> Reserva Confirmada
                    </span>
                  )}
                  <p className="text-sm text-gray-500 mt-2 md:mt-1">Parcelas: {reservation.paid_installments} / {reservation.installments}</p>
                </div>
              </div>

              <h4 className="font-semibold mb-2 mt-4">Passageiros:</h4>
              <div className="space-y-2">
                {reservation.passengers.map(passenger => (
                  <div key={passenger.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md border-l-4 border-gray-200">
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-3 text-gray-500" />
                      <div>
                        <p className="font-medium">{passenger.name}</p>
                        <p className="text-sm text-gray-500">Doc: {passenger.document}</p>
                      </div>
                    </div>
                     <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-3 text-gray-500" />
                      <p className="text-sm text-gray-600">{passenger.whatsapp}</p>
                    </div>
                    <div className="flex items-center text-sm font-medium">
                      <Armchair className="w-4 h-4 mr-2 text-gray-500" />
                      {passenger.seat_type.replace('-', ' ')} - Poltrona {passenger.seat_number}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-4 items-center">
                {reservation.paid_installments < reservation.installments ? (
                  <button onClick={() => handleMarkAsPaid(reservation)} className="flex items-center bg-brand-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transform hover:scale-105 transition-transform">
                    <CreditCard className="w-5 h-5 mr-2" />
                    {reservation.paid_installments === 0 ? 'Confirmar 1º Pagamento' : `Marcar Parcela Paga (${reservation.paid_installments + 1}/${reservation.installments})`}
                  </button>
                ) : (
                  <div className="flex items-center text-green-600 font-semibold bg-green-100 p-3 rounded-lg">
                    <Check className="w-5 h-5 mr-2" /> Pagamento Concluído!
                  </div>
                )}
                {reservation.status === 'confirmada' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleAction('share', reservation)} disabled={isProcessing === reservation.id} className="flex items-center bg-brand-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 transform hover:scale-105 transition-transform" title="Compartilhar Passagem">
                      {isProcessing === reservation.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
                      <span className="hidden sm:inline ml-2">Compartilhar</span>
                    </button>
                    <button onClick={() => handleAction('download', reservation)} disabled={isProcessing === reservation.id} className="flex items-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 transform hover:scale-105 transition-transform" title="Baixar Passagem">
                      {isProcessing === reservation.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                       <span className="hidden sm:inline ml-2">Baixar</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Hidden tickets for PDF generation */}
      <div className="absolute -left-full top-0 opacity-0 -z-10">
        {reservations.map(res => (
          <div key={`ticket-container-admin-${res.id}`} id={`ticket-admin-${res.id}`}>
            {settings.start_date && settings.end_date && <Ticket reservation={res} startDate={settings.start_date} endDate={settings.end_date} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
