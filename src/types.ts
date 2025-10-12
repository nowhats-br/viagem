export type SeatType = 'leito' | 'semi-leito';

export interface Passenger {
  id: string;
  name: string;
  document: string;
  seatType: SeatType;
  seatNumber: number | null;
}

export interface Payment {
  method: 'pix' | 'credit-card';
  installments: number;
}

export interface Reservation {
  id: string;
  passengers: Passenger[];
  payment: Payment | null;
  totalAmount: number;
  paidInstallments: number;
}
