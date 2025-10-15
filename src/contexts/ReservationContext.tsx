import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Passenger, ExcursionSettings, Payment } from '../types';
import { getExcursionSettings, saveReservationAndPassengers } from '../lib/supabase';

interface ReservationContextType {
  passengers: Passenger[];
  settings: ExcursionSettings | null;
  addPassenger: (passengerData: Omit<Passenger, 'id' | 'seatNumber'>) => Passenger;
  updatePassengerSeat: (passengerId: string, seatNumber: number) => void;
  removePassenger: (passengerId: string) => void;
  completeReservation: (payment: Payment) => Promise<void>;
  clearReservation: () => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const ReservationProvider = ({ children }: { children: ReactNode }) => {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [settings, setSettings] = useState<ExcursionSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getExcursionSettings();
        setSettings(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSettings();
  }, []);

  const addPassenger = useCallback((passengerData: Omit<Passenger, 'id' | 'seatNumber'>): Passenger => {
    const newPassenger: Passenger = {
      id: crypto.randomUUID(),
      ...passengerData,
      seatNumber: null,
    };
    setPassengers(prev => [...prev, newPassenger]);
    return newPassenger;
  }, []);

  const updatePassengerSeat = useCallback((passengerId: string, seatNumber: number) => {
    setPassengers(prev =>
      prev.map(p => (p.id === passengerId ? { ...p, seatNumber } : p))
    );
  }, []);

  const removePassenger = useCallback((passengerId: string) => {
    setPassengers(prev => prev.filter(p => p.id !== passengerId));
  }, []);

  const clearReservation = useCallback(() => {
    setPassengers([]);
  }, []);

  const completeReservation = useCallback(async (payment: Payment) => {
    if (!settings || passengers.length === 0 || passengers.some(p => p.seatNumber === null)) {
      throw new Error("Dados da reserva incompletos. Verifique os passageiros e assentos.");
    }

    const totalAmount = passengers.reduce((total, p) => {
      const price = p.seatType === 'leito' ? settings.leito_price : settings.semi_leito_price;
      return total + price;
    }, 0);

    const passengersToSave = passengers.map(({ id, ...rest }) => rest);

    await saveReservationAndPassengers(passengersToSave, totalAmount, payment);
    
    // Do not clear passengers here, confirmation page might need them briefly
  }, [settings, passengers]);

  return (
    <ReservationContext.Provider
      value={{
        passengers,
        settings,
        addPassenger,
        updatePassengerSeat,
        removePassenger,
        completeReservation,
        clearReservation,
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
