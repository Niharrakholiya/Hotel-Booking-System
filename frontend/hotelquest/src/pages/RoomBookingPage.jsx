import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import Layout from '@/features/Layout/Layout';
import HotelPhotos from '../features/Hotels/HotelPhotos';
import Overview from '../features/Hotels/Overview';
import RoomCard from '../features/cards/Roomcard';

const RoomBookingPage = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotelAndRooms = async () => {
      if (!id) return;
      
      // Get the authentication token from cookies
      const token = Cookies.get('jwt_token');
      
      // Prepare headers with authentication
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      try {
        // Fetch hotel details with auth headers
        const hotelResponse = await fetch(`http://localhost:5000/api/hotels/${id}`, {
          method: 'GET',
          headers
        });
        
        if (!hotelResponse.ok) {
          if (hotelResponse.status === 401) {
            throw new Error('Please login to view hotel details');
          }
          throw new Error('Failed to fetch hotel details');
        }
        const hotelData = await hotelResponse.json();
        
        // Fetch rooms with auth headers
        const roomsResponse = await fetch(`http://localhost:5000/api/hotels/${id}/rooms`, {
          method: 'GET',
          headers
        });
        
        if (!roomsResponse.ok) {
          if (roomsResponse.status === 401) {
            throw new Error('Please login to view room details');
          }
          throw new Error('Failed to fetch rooms');
        }
        const roomsData = await roomsResponse.json();
        
        setHotel(hotelData);
        setRooms(roomsData.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchHotelAndRooms();
  }, [id]);

  if (loading) return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          {error}
          {error.includes('Please login') && (
            <button 
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => window.location.href = '/login'}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </Layout>
  );

  if (!hotel) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{hotel.name}</h1>
        <HotelPhotos hotel={hotel} />
        <Overview hotel={hotel} />
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Available Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <RoomCard 
            key={room._id} 
            room={{
              _id: room._id,  // Make sure to include the room ID
              type: room.roomType,
              photo: room.photos[0] ? `http://localhost:5000/${room.photos[0]}` : null,
              amenities: room.amenities,
              price: room.pricePerNight,
              description: room.description,
              capacity: room.capacity,
              availability: room.roomAvailability
            }}
            hotelId={id}  // Pass the hotel ID from useParams
          />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default RoomBookingPage;