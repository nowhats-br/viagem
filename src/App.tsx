import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import PassengerRegistration from './pages/PassengerRegistration';
import SeatSelection from './pages/SeatSelection';
import Payment from './pages/Payment';
import Confirmation from './pages/Confirmation';
import Admin from './pages/Admin';
import CheckReservation from './pages/CheckReservation';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import { ReservationProvider } from './contexts/ReservationContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <ReservationProvider>
        <Router>
          <Header />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/nova-reserva/:seatType" element={<PassengerRegistration />} />
              <Route path="/selecionar-assento/:passengerId" element={<SeatSelection />} />
              <Route path="/pagamento" element={<Payment />} />
              <Route path="/confirmacao" element={<Confirmation />} />
              <Route path="/consultar-reserva" element={<CheckReservation />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </Router>
      </ReservationProvider>
    </AuthProvider>
  );
}

export default App;
