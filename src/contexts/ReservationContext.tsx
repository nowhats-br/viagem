import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Passenger, Reservation, SeatType } from '../types';
import { faker } from '@faker-js/faker';

interface ReservationContextType {
  passengers: Passenger[];
  reservations: Reservation[];
  addPassenger: (name: string, document: string, seatType: SeatType) => Passenger;
  updatePassengerSeat: (passengerId: string, seatNumber: number) => void;
  addAnotherPassenger: () => void;
  completeReservation: (payment: Reservation['payment']) => void;
  markInstallmentAsPaid: (reservationId: string) => void;
  getOccupiedSeats: (seatType: SeatType) => number[];
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

// Mock initial occupied seats
const initialOccupiedLeito = [3, 10];
const initialOccupiedSemiLeito = [5, 12, 25, 26, 29, 30];

export const ReservationProvider = ({ children }: { children: ReactNode }) => {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const addPassenger = (name: string, document: string, seatType: SeatType): Passenger => {
    const newPassenger: Passenger = {
      id: faker.string.uuid(),
      name,
      document,
      seatType,
      seatNumber: null,
    };
    setPassengers(prev => [...prev, newPassenger]);
    return newPassenger;
  };

  const updatePassengerSeat = (passengerId: string, seatNumber: number) => {
    setPassengers(prev =>
      prev.map(p => (p.id === passengerId ? { ...p, seatNumber } : p))
    );
  };

  const addAnotherPassenger = () => {
    // This function will be used to reset the flow for a new passenger
    // In a real app, you might navigate back to the registration form
    console.log("Adding another passenger");
  };

  const completeReservation = (payment: Reservation['payment']) => {
    const newReservation: Reservation = {
      id: faker.string.uuid(),
      passengers: [...passengers],
      payment,
      totalAmount: passengers.length * (passengers[0]?.seatType === 'leito' ? 189.99 : 119.99),
      paidInstallments: 0,
    };
    setReservations(prev => [...prev, newReservation]);
    setPassengers([]); // Clear current passengers for the next reservation
  };

  const markInstallmentAsPaid = (reservationId: string) => {
    setReservations(prev =>
      prev.map(r => {
        if (r.id === reservationId && r.payment && r.paidInstallments < r.payment.installments) {
          return { ...r, paidInstallments: r.paidInstallments + 1 };
        }
        return r;
      })
    );
  };
  
  const getOccupiedSeats = (seatType: SeatType): number[] => {
    const reservedSeats = reservations
      .flatMap(r => r.passengers)
      .filter(p => p.seatType === seatType && p.seatNumber !== null)
      .map(p => p.seatNumber as number);
      
    const initialSeats = seatType === 'leito' ? initialOccupiedLeito : initialOccupiedSemiLeito;
    
    return [...initialSeats, ...reservedSeats];
  };

  return (
    <ReservationContext.Provider
      value={{
        passengers,
        reservations,
        addPassenger,
        updatePassengerSeat,
        addAnotherPassenger,
        completeReservation,
        markInstallmentAsPaid,
        getOccupiedSeats
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
};
