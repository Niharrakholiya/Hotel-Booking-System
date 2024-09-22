import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import HeroSection from '@/features/Hotels/HeroSection';
import ExploreIndia from '@/features/Hotels/ExploreIndia';
import Layout from '@/features/Layout/Layout';
import { useAuth } from '../features/auth/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = Cookies.get('jwt_token');
        if (token) {
          // If a token exists, consider the user authenticated
          login(token);
        } else if (!isAuthenticated) {
          // If no token and not authenticated, redirect to auth page
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        // Handle the error appropriately, e.g., show an error message to the user
      }
    };

    checkAuthStatus();
  }, [isAuthenticated, login, navigate]);

  return (
    <Layout>
      <HeroSection />
      <ExploreIndia />
    </Layout>
  );
};

export default LandingPage;