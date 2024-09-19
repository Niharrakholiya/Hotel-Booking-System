// src/features/hotel/HotelCard.jsx
import React from 'react';

const HotelCard = ({ id, name, location, price }) => {
    return (
      <div className="relative group overflow-hidden rounded-lg shadow-lg w-64">
        <img
          alt={`Featured Hotel ${id}`}
          className="object-cover w-full h-40 transition-transform group-hover:scale-105"
          src={`https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
          style={{
            aspectRatio: "400/300",
            objectFit: "cover",
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-end p-3">
          
        </div>
      </div>
    );
  };
  
  export default HotelCard;
  
