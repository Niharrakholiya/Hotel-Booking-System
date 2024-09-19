// src/components/HotelList.jsx
import React, { useState } from 'react';
import HotelCard from '../cards/HotelCard';

const HotelList = ({ hotels }) => {
  const [sortBy, setSortBy] = useState('recommended');

  const sortedHotels = [...hotels].sort((a, b) => {
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    if (sortBy === 'rating') return b.review - a.review;
    return 0; // Default: recommended
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">{sortedHotels.length} hotels found</p>
        <select
          className="border rounded p-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="recommended">Recommended</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedHotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

export default HotelList;
