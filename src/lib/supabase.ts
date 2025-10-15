import { createClient } from '@supabase/supabase-js';
import { ExcursionSettings, Passenger, Payment, Reservation } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined in .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getExcursionSettings = async (): Promise<ExcursionSettings> => {
    const { data, error } = await supabase
        .from('excursion_settings')
        .select('*')
        .limit(1)
        .single();

    if (error) {
        console.error('Error fetching excursion settings:', error);
        throw new Error('Não foi possível carregar as configurações da excursão.');
    }
    
    if (!data) {
        const { data: defaultData, error: insertError } = await supabase
            .from('excursion_settings')
            .insert({ leito_price: 189.99, semi_leito_price: 119.99 })
            .select()
            .single();
        if(insertError) throw new Error('Não foi possível criar as configurações padrão.');
        return defaultData;
    }

    return data;
}

export const getOccupiedSeats = async (): Promise<number[]> => {
    const { data, error } = await supabase
        .from('passengers')
        .select('seat_number, reservation:reservations(status)')
        .filter('reservation.status', 'eq', 'confirmada');

    if (error) {
        console.error('Error fetching occupied seats:', error);
        return [];
    }

    return data.map(p => p.seat_number).filter(Boolean) as number[];
}

export const saveReservationAndPassengers = async (
    passengers: Omit<Passenger, 'id'>[], 
    totalAmount: number, 
    payment: Payment
): Promise<void> => {
    
    const { data: reservationResult, error: reservationError } = await supabase
        .from('reservations')
        .insert({
            total_amount: totalAmount,
            payment_method: payment.method,
            installments: payment.installments,
            paid_installments: 0,
            status: 'pendente',
        })
        .select()
        .single();

    if (reservationError) {
        console.error('Error saving reservation:', reservationError);
        throw new Error('Não foi possível criar a reserva.');
    }

    const newReservationId = reservationResult.id;

    const passengersToInsert = passengers.map(p => ({
        name: p.name,
        document: p.document,
        city: p.city,
        pastor_name: p.pastor_name,
        whatsapp: p.whatsapp,
        seat_type: p.seatType,
        seat_number: p.seatNumber,
        reservation_id: newReservationId,
    }));

    const { error: passengersError } = await supabase
        .from('passengers')
        .insert(passengersToInsert);

    if (passengersError) {
        console.error('Error saving passengers:', passengersError);
        await supabase.from('reservations').delete().eq('id', newReservationId);
        throw new Error('Não foi possível salvar os passageiros. A reserva foi cancelada.');
    }
};

export const findReservationsByCPF = async (cpf: string): Promise<Reservation[]> => {
    const { data: passengerData, error: passengerError } = await supabase
        .from('passengers')
        .select('reservation_id')
        .eq('document', cpf);

    if (passengerError) {
        console.error('Error finding passenger by CPF:', passengerError);
        throw new Error('Erro ao buscar passageiro.');
    }
    
    if (!passengerData || passengerData.length === 0) {
        return [];
    }

    const reservationIds = [...new Set(passengerData.map(p => p.reservation_id))];

    const { data: reservationData, error: reservationError } = await supabase
        .from('reservations')
        .select(`*, passengers (*)`)
        .in('id', reservationIds)
        .order('created_at', { ascending: false });

    if (reservationError) {
        console.error('Error fetching reservations by ID:', reservationError);
        throw new Error('Erro ao carregar as reservas associadas.');
    }

    return reservationData as Reservation[];
};
