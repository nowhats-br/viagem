import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import PassengerRegistration from './pages/PassengerRegistration';
import SeatSelection from './pages/SeatSelection';
import Payment from './pages/Payment';
import Confirmation from './pages/Confirmation';
import Admin from './pages/Admin';
import { ReservationProvider } from './contexts/ReservationContext';

function App() {
  return (
    <ReservationProvider>
      <Router>
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<PassengerRegistration />} />
            <Route path="/selecionar-assento/:passengerId" element={<SeatSelection />} />
            <Route path="/pagamento" element={<Payment />} />
            <Route path="/confirmacao" element={<Confirmation />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </Router>
    </ReservationProvider>
  );
}

export default App;
