import React from 'react';
import BookingForm from '../features/Hotels/BookingForm';
import Layout from '@/features/Layout/Layout';

const UserDetailsPage = () => {
  const checkIn = "2024-09-15"; // Example date
  const checkOut = "2024-09-16"; // Example date

  return (
    <Layout>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Book Your Stay</h1>
      <BookingForm 
        numberOfMembers={2} 
        checkIn={checkIn} 
        checkOut={checkOut} 
      />
    </div>
    </Layout>
  );
};

export default UserDetailsPage;