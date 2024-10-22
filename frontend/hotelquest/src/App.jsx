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
import HotelDashboard from './features/admin/HotelDashboard';
import RoomManagement from './features/admin/Roomadd';
import CompleteProfile from './features/admin/CompleteProfile';
import HotelManagement from './features/admin/HotelManagement';
import RoomManage from './features/admin/RoomManagement';
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
      <Route 
        path="/roomadd" 
        element={
          <PrivateRoute>
            <RoomManagement />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/complete-profile" 
        element={
          <PrivateRoute>
            <CompleteProfile />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/Edit-Details" 
        element={
          <PrivateRoute>
            <HotelManagement />
          </PrivateRoute>
        } 
      />
      <Route 
    path="/Edit-room" 
    element={
          <PrivateRoute>
            <RoomManage />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

export default App;