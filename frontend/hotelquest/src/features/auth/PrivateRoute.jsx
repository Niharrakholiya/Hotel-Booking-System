import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './features/auth/AuthContext';

// Enhanced PrivateRoute component with strict role checking
const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center p-4">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // Strict role checking
  if (!allowedRoles.includes(userRole)) {
    // Redirect based on role
    if (userRole === 'hotel') {
      return <Navigate to="/hotel-dashboard" replace />;
    } else if (userRole === 'customer') {
      return <Navigate to="/hotels" replace />;
    }
    // Default fallback
    return <Navigate to="/" replace />;
  }

  return children;
};