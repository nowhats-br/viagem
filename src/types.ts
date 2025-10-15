export type SeatType = 'leito' | 'semi-leito';

export interface Passenger {
  // Local temporary ID, created in the frontend
  id: string; 
  name: string;
  document: string; // CPF
  city: string;
  pastor_name: string;
  whatsapp: string;
  seatType: SeatType;
  seatNumber: number | null;
}

export interface Payment {
  method: 'pix' | 'credit_card';
  installments: number;
}

export interface Reservation {
  id: number;
  created_at: string;
  passengers: {
    id: number;
    name: string;
    document: string;
    city: string;
    pastor_name: string;
    whatsapp: string;
    seat_number: number;
    seat_type: SeatType;
  }[];
  total_amount: number;
  payment_method: 'pix' | 'credit_card';
  installments: number;
  paid_installments: number;
  status: 'pendente' | 'confirmada' | 'cancelada';
}

export interface ExcursionSettings {
    id: number;
    leito_price: number;
    semi_leito_price: number;
}
