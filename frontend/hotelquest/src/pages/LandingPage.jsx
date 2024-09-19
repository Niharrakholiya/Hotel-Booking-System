// src/pages/index.js or src/pages/LandingPage.jsx
import React from 'react';
import HeroSection from '@/features/Hotels/HeroSection';
import ExploreIndia from '@/features/Hotels/ExploreIndia';
import Layout from '@/features/Layout/Layout';


const LandingPage = () => {
  return (
    <Layout>
     <HeroSection />
     <ExploreIndia />
    </Layout>
     
     
  );
};

export default LandingPage;