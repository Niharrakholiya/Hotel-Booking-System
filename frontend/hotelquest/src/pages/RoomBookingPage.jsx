import React, { useState } from 'react';
import Layout from '@/features/Layout/Layout';
import HotelPhotos from '../features/Hotels/HotelPhotos';
import Overview from '../features/Hotels/Overview';
import RoomCard from '../features/cards/RoomCard';

const RoomBookingPage = ({ hotelId }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  // Mock data for the hotel
  const hotel = {
    id: hotelId,
    name: "Luxury Palace Hotel",
    location: "Mumbai, India",
    distanceToRailway: 2.5,
    distanceToAirport: 15,
    rooms: [
      {
        type: "Standard",
        photo: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
        amenities: ["Free Wi-Fi", "TV", "Air Conditioning"],
        price: 1000
      },
      {
        type: "Deluxe",
        photo: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
        amenities: ["Free Wi-Fi", "TV", "Air Conditioning", "Mini Bar"],
        price: 1500
      },
      {
        type: "Suite",
        photo: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        amenities: ["Free Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Jacuzzi"],
        price: 2500
      }
    ]
  };
  const additionalServices = [
    { id: 'tourGuide', name: 'Tour Guide', price: 50 },
    { id: 'taxiService', name: 'Taxi Service', price: 30 }
  ];

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prevServices =>
      prevServices.includes(serviceId)
        ? prevServices.filter(id => id !== serviceId)
        : [...prevServices, serviceId]
    );
  };

  const calculateTotalPrice = () => {
    let total = selectedRoom ? selectedRoom.price : 0;
    selectedServices.forEach(serviceId => {
      const service = additionalServices.find(s => s.id === serviceId);
      if (service) {
        total += service.price;
      }
    });
    return total;
  };

  const handleBookRoom = (room) => {
    setSelectedRoom(room);
    // Here you would typically open a modal or navigate to a booking form
    console.log("Booking room:", room);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{hotel.name}</h1>
        <HotelPhotos hotel={hotel} />
        <Overview hotel={hotel} />
        
        {/* Corrected part: Map through hotel rooms */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotel.rooms.map((room, index) => (
            <RoomCard key={index} room={room} onBook={handleBookRoom} />
          ))}
        </div>

      
      </div>
    </Layout>
  );
};

export default RoomBookingPage;
