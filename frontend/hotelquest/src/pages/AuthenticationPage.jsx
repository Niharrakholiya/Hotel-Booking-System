import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/features/Layout/Layout';
import AuthForm from '@/features/auth/AuthForm';
import { useAuth } from '@/features/auth/AuthContext';
function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, userRole } = useAuth();

  const onLoginSuccess = () => {
    const from = location.state?.from || '/';
    
    // Redirect based on role
    if (userRole === 'hotel') {
      navigate('/hotel-dashboard');
    } else if (userRole === 'customer') {
      navigate('/hotels');
    } else {
      navigate(from);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Our Platform
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please log in or sign up to continue
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <AuthForm onLoginSuccess={onLoginSuccess} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AuthPage ;