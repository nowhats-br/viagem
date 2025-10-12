import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReservation } from '../contexts/ReservationContext';
import { Armchair, Smartphone, Printer, ShieldCheck, X } from 'lucide-react';

const Seat: React.FC<{ number: number; status: 'free' | 'occupied' | 'selected'; onClick: () => void }> = ({ number, status, onClick }) => {
  const baseClasses = "w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-bold rounded-md border-2 transition-transform transform hover:scale-110";
  const statusClasses = {
    free: "bg-seat-free border-green-600 text-white cursor-pointer",
    occupied: "bg-seat-occupied border-gray-400 text-gray-500 cursor-not-allowed",
    selected: "bg-seat-selected border-yellow-600 text-white ring-2 ring-offset-2 ring-yellow-500",
  };
  
  if (status === 'occupied') {
    return (
      <div className={`${baseClasses} ${statusClasses.occupied}`}>
        <X className="w-6 h-6" />
      </div>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${statusClasses[status]}`} disabled={status === 'occupied'}>
      {number}
    </button>
  );
};

const SeatLayout: React.FC<{ type: 'leito' | 'semi-leito', selectedSeat: number | null, onSelect: (seat: number) => void, occupiedSeats: number[] }> = ({ type, selectedSeat, onSelect, occupiedSeats }) => {
  if (type === 'leito') {
    const seats = Array.from({ length: 12 }, (_, i) => i + 1);
    const layout = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [10, 11, 12],
    ];
    return (
        <div className="p-4 bg-gray-200 rounded-t-3xl rounded-b-lg relative">
            <div className="absolute top-1/2 -translate-y-1/2 left-4">
                <Armchair className="w-8 h-8 text-gray-500 transform -rotate-90" />
            </div>
            <div className="grid grid-cols-3 gap-x-8 gap-y-4 ml-16">
                {seats.map(seat => {
                    const status = occupiedSeats.includes(seat) ? 'occupied' : selectedSeat === seat ? 'selected' : 'free';
                    return <Seat key={seat} number={seat} status={status} onClick={() => onSelect(seat)} />;
                })}
            </div>
        </div>
    );
  }

  // Semi-Leito Layout
  const seats = Array.from({ length: 44 }, (_, i) => i + 1);
  const layout = [
    [1, 2, null, 3, 4],
    [5, 6, null, 7, 8],
    [9, 10, null, 11, 12],
    [13, 14, null, 15, 16],
    [17, 18, null, 19, 20],
    [21, 22, null, 23, 24],
    [25, 26, null, 27, 28],
    [29, 30, null, 31, 32],
    [33, 34, null, 35, 36],
    [37, 38, null, 39, 40],
    [41, 42, null, 43, 44],
  ];

  return (
    <div className="p-4 bg-gray-200 rounded-t-3xl rounded-b-lg relative w-full max-w-lg">
        <div className="absolute top-1/2 -translate-y-1/2 left-4">
            <Armchair className="w-8 h-8 text-gray-500 transform -rotate-90" />
        </div>
        <div className="grid grid-cols-5 gap-2 ml-16">
            {layout.flat().map((seat, index) => {
                if (seat === null) return <div key={`aisle-${index}`} className="w-full"></div>;
                const status = occupiedSeats.includes(seat) ? 'occupied' : selectedSeat === seat ? 'selected' : 'free';
                return <Seat key={seat} number={seat} status={status} onClick={() => onSelect(seat)} />;
            })}
        </div>
    </div>
  );
};


const SeatSelection: React.FC = () => {
    const { passengerId } = useParams<{ passengerId: string }>();
    const navigate = useNavigate();
    const { passengers, updatePassengerSeat, getOccupiedSeats, addAnotherPassenger } = useReservation();
    const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

    const passenger = passengers.find(p => p.id === passengerId);

    if (!passenger) {
        return <div className="text-center mt-10">Passageiro não encontrado. <button onClick={() => navigate('/')} className="text-brand-purple">Voltar ao início</button></div>;
    }
    
    const occupiedSeats = getOccupiedSeats(passenger.seatType);

    const handleSelectSeat = (seatNumber: number) => {
        if (occupiedSeats.includes(seatNumber)) return;
        setSelectedSeat(seatNumber);
    };

    const handleContinue = () => {
        if (selectedSeat !== null) {
            updatePassengerSeat(passenger.id, selectedSeat);
            // Open modal or navigate
            setShowConfirmationModal(true);
        }
    };
    
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const handleAddAnother = () => {
        addAnotherPassenger();
        navigate('/');
    };

    const handleGoToPayment = () => {
        navigate('/pagamento');
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex flex-wrap justify-between items-center mb-6 border-b pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Selecione seu assento</h1>
                        <p className="text-gray-500">Passageiro: {passenger.name}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-semibold">{passenger.seatType === 'leito' ? 'Leito DD' : 'Semi-Leito DD'}</p>
                        <p className="text-2xl font-bold text-brand-purple">{passenger.seatType === 'leito' ? 'R$ 189,99' : 'R$ 119,99'}</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-2/3 flex justify-center">
                        <SeatLayout type={passenger.seatType} selectedSeat={selectedSeat} onSelect={handleSelectSeat} occupiedSeats={occupiedSeats} />
                    </div>
                    <div className="w-full lg:w-1/3">
                        <h3 className="font-bold text-lg mb-4">Legenda</h3>
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center"><div className="w-6 h-6 rounded bg-seat-free mr-2"></div> Livre</div>
                            <div className="flex items-center"><div className="w-6 h-6 rounded bg-seat-selected mr-2"></div> Selecionado</div>
                            <div className="flex items-center"><div className="w-6 h-6 rounded bg-seat-occupied mr-2 flex items-center justify-center text-white"><X size={18}/></div> Ocupado</div>
                        </div>
                        <button onClick={handleContinue} disabled={!selectedSeat} className="w-full bg-brand-yellow hover:bg-yellow-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed">
                            Continuar Reserva
                        </button>
                    </div>
                </div>
                
                <div className="mt-8 border-t pt-6 flex flex-wrap justify-center gap-4 text-gray-600">
                    <div className="flex items-center"><Smartphone size={18} className="mr-2"/> Passagem no celular</div>
                    <div className="flex items-center"><ShieldCheck size={18} className="mr-2"/> Segurança Reforçada</div>
                    <div className="flex items-center"><Printer size={18} className="mr-2"/> Passagem impressa</div>
                </div>
            </div>

            {showConfirmationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
                        <h3 className="text-xl font-bold mb-4">Reserva Adicionada!</h3>
                        <p className="mb-6 text-gray-600">O que você gostaria de fazer agora?</p>
                        <div className="space-y-3">
                            <button onClick={handleAddAnother} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">
                                Cadastrar Outro Passageiro
                            </button>
                            <button onClick={handleGoToPayment} className="w-full bg-brand-yellow hover:bg-yellow-400 text-gray-800 font-bold py-2 px-4 rounded-lg">
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
