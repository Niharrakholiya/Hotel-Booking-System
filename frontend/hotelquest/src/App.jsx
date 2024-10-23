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
import GuestDetailsPage from './pages/GuestDetailsPage';
import PaymentPage from './pages/PayementPage';
import MyBookings from './pages/MyBookingPage';
// Updated PrivateRoute component with role checking
const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  // Check if user's role is included in the allowedRoles array
  if (!allowedRoles.includes(userRole)) {
    // Redirect based on role
    if (userRole === 'hotel') {
      return <Navigate to="/complete-profile" />;
    } else if (userRole === 'customer') {
      return <Navigate to="/hotels" />;
    }
    return <Navigate to="/" />;
  }

  return children;
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
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Customer-only Routes */}
      <Route 
        path="/hotels" 
        element={
          <PrivateRoute allowedRoles={['customer']}>
            <HotelBooking />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/hotels/:id" 
        element={
          <PrivateRoute allowedRoles={['customer']}>
            <RoomBookingPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/booking/guest-details" 
        element={
          <PrivateRoute allowedRoles={['customer']}>
            <GuestDetailsPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/booking/payment" 
        element={
          <PrivateRoute allowedRoles={['customer']}>
            <PaymentPage />
          </PrivateRoute>
        } 
      />

      {/* Hotel/Admin-only Routes */}
      <Route 
        path="/complete-profile" 
        element={
          <PrivateRoute allowedRoles={['hotel']}>
            <CompleteProfile />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/Edit-Details" 
        element={
          <PrivateRoute allowedRoles={['hotel']}>
            <HotelManagement />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/Edit-room" 
        element={
          <PrivateRoute allowedRoles={['hotel']}>
            <RoomManage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/My-Bookings" 
        element={
          <PrivateRoute allowedRoles={['customer']}>
            <MyBookings />
          </PrivateRoute>
        } 
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;