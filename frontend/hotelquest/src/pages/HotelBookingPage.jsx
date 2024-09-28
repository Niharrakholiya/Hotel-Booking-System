import React, { useEffect, useState } from 'react';
import Layout from '@/features/Layout/Layout';
import HotelList from '@/features/Hotels/HotelList';
import SearchbarBooking from '@/features/Hotels/SearchbarBooking';

const HotelBooking = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/hotels'); // Ensure this URL matches your backend
        if (!response.ok) {
          throw new Error('Failed to fetch hotels');
        }
        const data = await response.json();
        console.log(data); // Log fetched data
        setHotels(data); // Update state with fetched data
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error:', error);
        setError(error.message); // Set error state
        setLoading(false); // Set loading to false even if there is an error
      }

    };

    fetchHotels();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <SearchbarBooking />
        <HotelList hotels={hotels} />
      </div>
    </Layout>
  );
};

export default HotelBooking;
