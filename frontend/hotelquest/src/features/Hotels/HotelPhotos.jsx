import React from 'react';

const HotelPhotos = ({ hotel }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-bold mb-4">Photos</h2>
    <div className="grid grid-cols-3 gap-4">
      {hotel.rooms.map((room, index) => (
        <img
          key={index}
          src={room.photo}
          alt={`${hotel.name} - ${room.type} Room`}
          className="w-full h-48 object-cover rounded-lg"
        />
      ))}
    </div>
  </section>
);

export default HotelPhotos;