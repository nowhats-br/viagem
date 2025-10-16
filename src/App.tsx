import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import Splash from './pages/Splash';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isSplash = location.pathname === '/';

  return (
    <>
      {!isSplash && <Header />}
      <main className={`container mx-auto px-4 sm:px-6 lg:px-8 ${!isSplash ? 'py-8' : ''}`}>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<Home />} />
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
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ReservationProvider>
        <Router>
          <AppContent />
        </Router>
      </ReservationProvider>
    </AuthProvider>
  );
}

export default App;
