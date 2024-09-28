import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import LandingPage from './pages/LandingPage';
import HotelBooking from './pages/HotelBookingPage';
import RoomBookingPage from './pages/RoomBookingPage';
import UserDetailsPage from './pages/UserDetailsPage';
import AuthPage from './pages/AuthenticationPage';
import HotelDashboard from './admin/HotelDashboard';
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const setAxiosAuthHeader = () => {
      const token = Cookies.get('jwt_token');
      if (isAuthenticated && token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        delete axios.defaults.headers.common['Authorization'];
      }
    };

    try {
      setAxiosAuthHeader();
    } catch (error) {
      console.error('Error setting axios headers:', error);
    }
  }, [isAuthenticated]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route 
        path="/hotels" 
        element={
          <PrivateRoute>
            <HotelBooking />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/book" 
        element={
          <PrivateRoute>
            <RoomBookingPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/details" 
        element={
          <PrivateRoute>
            <UserDetailsPage />
          </PrivateRoute>
        } 
      />
       <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <HotelDashboard />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

export default App;