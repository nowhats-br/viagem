import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReservation } from '../contexts/ReservationContext';
import { getOccupiedSeats } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

type SeatStatus = 'free' | 'occupied' | 'selected';

const Seat: React.FC<{ number: number; status: SeatStatus; onClick: () => void; }> = ({ number, status, onClick }) => {
  const baseClasses = "w-10 h-10 flex items-center justify-center font-bold rounded-md border-2 transition-all text-xs shadow-sm";
  const statusClasses: Record<SeatStatus, string> = {
    free: "bg-seat-free border-green-700 text-white hover:opacity-80",
    occupied: "bg-seat-occupied border-red-700 text-white cursor-not-allowed opacity-60",
    selected: "bg-seat-selected border-yellow-700 text-white ring-2 ring-offset-2 ring-offset-gray-100 ring-brand-blue",
  };
  
  return (
    <button onClick={onClick} disabled={status === 'occupied'} className={`${baseClasses} ${statusClasses[status]}`}>
      {String(number).padStart(2, '0')}
    </button>
  );
};

const SeatSelection: React.FC = () => {
    const { passengerId } = useParams<{ passengerId: string }>();
    const navigate = useNavigate();
    const { passengers, updatePassengerSeat } = useReservation();
    const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
    const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const passenger = useMemo(() => passengers.find(p => p.id === passengerId), [passengers, passengerId]);

    useEffect(() => {
        if (!passenger) {
            navigate('/');
            return;
        }
        const fetchSeats = async () => {
            setLoading(true);
            const dbOccupiedSeats = await getOccupiedSeats();
            const sessionOccupied = passengers
                .filter(p => p.id !== passengerId && p.seatNumber !== null)
                .map(p => p.seatNumber as number);
            setOccupiedSeats([...dbOccupiedSeats, ...sessionOccupied]);
            setLoading(false);
        };
        fetchSeats();
    }, [passenger, passengers, passengerId, navigate]);

    if (!passenger) {
        return null; // Redirect is handled in useEffect
    }
    
    const handleSelectSeat = (seatNumber: number) => {
        setSelectedSeat(seatNumber);
    };

    const handleContinue = () => {
        if (selectedSeat !== null) {
            updatePassengerSeat(passenger.id, selectedSeat);
            setShowConfirmationModal(true);
        }
    };

    const handleAddAnother = () => navigate('/');
    const handleGoToPayment = () => navigate('/pagamento');
    
    const superiorLayout = [
        [1, 2, null, 3, 4], [5, 6, null, 7, 8], [9, 10, null, 11, 12],
        [13, 14, null, 15, 16], [17, 18, null, 19, 20], [21, 22, null, 23, 24],
        [25, 26, null, 27, 28], [29, 30, null, 31, 32], [33, 34, null, 35, 36],
        [37, 38, null, 39, 40], [41, 42, null, 43, 44]
    ];

    const inferiorLayout = [
        [45, null, 46, 47],
        [48, null, 49, 50],
        [51, null, 52, 53],
        [54, null, 55, 56],
    ];

    const renderBusLayout = (layout: (number | null)[][], isFourCols: boolean) => (
        <div className={`grid ${isFourCols ? 'grid-cols-4' : 'grid-cols-5'} gap-2.5`}>
            {layout.flat().map((item, index) => {
                if (typeof item === 'number') {
                    const isOccupied = occupiedSeats.includes(item);
                    const isSelected = selectedSeat === item;
                    let status: SeatStatus = isSelected ? 'selected' : isOccupied ? 'occupied' : 'free';
                    return <Seat key={item} number={item} status={status} onClick={() => handleSelectSeat(item)} />;
                }
                if (item === null) return <div key={`aisle-${index}`} />;
                return <div key={`unknown-${index}`} />;
            })}
        </div>
    );

    const currentLayout = passenger.seatType === 'leito' ? inferiorLayout : superiorLayout;
    const isLeito = passenger.seatType === 'leito';

    return (
        <div className="container mx-auto p-4 md:p-8 bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Selecione seu assento</h1>
            <p className="text-gray-500 text-center mb-8">Passageiro: <span className="font-semibold">{passenger.name}</span></p>

            {loading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 animate-spin text-brand-blue" /></div>
            ) : (
                <div className="flex flex-col xl:flex-row gap-8 items-start justify-center">
                    {/* Bus Layout Container */}
                    <div className="w-full xl:flex-grow flex justify-center">
                        <div className="p-6 bg-white rounded-2xl shadow-lg border-2 border-gray-200 relative">
                            <div className="absolute top-4 left-4 text-xs font-bold text-gray-500">FRENTE</div>
                            <h3 className="text-center font-bold mb-6 text-gray-700 text-lg">
                                {isLeito ? 'PISO INFERIOR (LEITO)' : 'PISO SUPERIOR (SEMI-LEITO)'}
                            </h3>
                            {renderBusLayout(currentLayout, isLeito)}
                        </div>
                    </div>

                    {/* Legend and Actions */}
                    <div className="w-full xl:w-1/3 bg-white p-6 rounded-lg shadow-md sticky top-8 max-w-sm mx-auto">
                        <h3 className="font-bold text-lg mb-4">Legenda</h3>
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center"><div className="w-6 h-6 rounded bg-seat-free mr-2 border border-green-700"></div> Livre</div>
                            <div className="flex items-center"><div className="w-6 h-6 rounded bg-seat-selected mr-2 border border-yellow-700"></div> Selecionado</div>
                            <div className="flex items-center"><div className="w-6 h-6 rounded bg-seat-occupied mr-2 border border-red-700"></div> Ocupado</div>
                        </div>
                        <button onClick={handleContinue} disabled={!selectedSeat} className="w-full bg-brand-yellow hover:bg-yellow-500 text-gray-800 font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed">
                            Confirmar Assento
                        </button>
                    </div>
                </div>
            )}

            {showConfirmationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
                        <h3 className="text-xl font-bold mb-4">Assento Confirmado!</h3>
                        <p className="mb-6 text-gray-600">O que você gostaria de fazer agora?</p>
                        <div className="space-y-3">
                            <button onClick={handleAddAnother} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">
                                Adicionar Outro Passageiro
                            </button>
                            <button onClick={handleGoToPayment} className="w-full bg-brand-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                                Ir para Pagamento
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeatSelection;
