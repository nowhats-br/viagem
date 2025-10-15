import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Reservation, ExcursionSettings } from '../types';
import { User, CreditCard, Check, Armchair, Loader2, Save, DollarSign, LogOut, Phone, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [settings, setSettings] = useState<Partial<ExcursionSettings>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        .update({ leito_price: settings.leito_price, semi_leito_price: settings.semi_leito_price })
        .eq('id', 1);

    if (error) alert('Erro ao salvar configurações.');
    else alert('Preços atualizados com sucesso!');
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

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">Configurações da Excursão</h2>
        <form onSubmit={handleSettingsSave} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="leito_price" className="block text-sm font-medium text-gray-700">Preço Poltrona Leito</label>
            <div className="relative mt-1">
              <DollarSign className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="number" step="0.01" id="leito_price" value={settings.leito_price || ''} onChange={e => setSettings({...settings, leito_price: parseFloat(e.target.value)})} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md" required />
            </div>
          </div>
          <div>
            <label htmlFor="semi_leito_price" className="block text-sm font-medium text-gray-700">Preço Poltrona Semi-Leito</label>
            <div className="relative mt-1">
              <DollarSign className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="number" step="0.01" id="semi_leito_price" value={settings.semi_leito_price || ''} onChange={e => setSettings({...settings, semi_leito_price: parseFloat(e.target.value)})} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md" required />
            </div>
          </div>
          <button type="submit" className="bg-brand-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center">
            <Save className="w-5 h-5 mr-2" /> Salvar Preços
          </button>
        </form>
      </div>

      <h2 className="text-2xl font-bold mb-4">Reservas Realizadas</h2>
      {reservations.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">Nenhuma reserva encontrada.</p>
      ) : (
        <div className="space-y-6">
          {reservations.map(reservation => (
            <div key={reservation.id} className="bg-white p-6 rounded-lg shadow-md">
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
                    <span className="flex items-center text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full text-sm">
                      <Check className="w-4 h-4 mr-2" /> Reserva Confirmada
                    </span>
                  )}
                  <p className="text-sm text-gray-500 mt-2 md:mt-1">Parcelas: {reservation.paid_installments} / {reservation.installments}</p>
                </div>
              </div>

              <h4 className="font-semibold mb-2 mt-4">Passageiros:</h4>
              <div className="space-y-2">
                {reservation.passengers.map(passenger => (
                  <div key={passenger.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-3 rounded-md">
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
                    <div className="flex items-center text-sm">
                      <Armchair className="w-4 h-4 mr-1 text-gray-500" />
                      {passenger.seat_type} - {passenger.seat_number}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-2">Controle de Pagamento</h4>
                {reservation.paid_installments < reservation.installments ? (
                  <button onClick={() => handleMarkAsPaid(reservation)} className="flex items-center bg-brand-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                    <CreditCard className="w-5 h-5 mr-2" />
                    {reservation.paid_installments === 0 ? 'Confirmar 1º Pagamento' : `Marcar Parcela Paga (${reservation.paid_installments + 1}/${reservation.installments})`}
                  </button>
                ) : (
                  <div className="flex items-center text-green-600 font-semibold bg-green-100 p-3 rounded-lg">
                    <Check className="w-5 h-5 mr-2" /> Pagamento Concluído!
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
