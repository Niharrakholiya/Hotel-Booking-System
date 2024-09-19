// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; // Import the HomePage from index.js
import HotelBooking from './pages/HotelBookingPage'; // Ensure the path is correct
import BookingPage from './pages/RoomBookingPage';
import RoomBookingPage from './pages/RoomBookingPage';
import UserDetailsPage from './pages/UserDetailsPage';

function App() {
  return (
    <div>
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/hotels" element={<HotelBooking />} />
          <Route path="/book" element={<RoomBookingPage/>} />
          <Route path="/details" element={<UserDetailsPage/>} />

        </Routes>
        
      </main>
    </div>
  );
}

export default App;
