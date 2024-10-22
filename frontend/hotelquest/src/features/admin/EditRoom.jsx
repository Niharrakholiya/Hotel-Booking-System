// src/components/EditRoom.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditRoom = ({ roomId, onClose }) => {
  const [roomData, setRoomData] = useState({
    category: '',
    price: '',
    availability: '',
    amenities: '',
  });

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(`/api/hotels/rooms/${roomId}`);
        setRoomData(response.data);
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };
    fetchRoomData();
  }, [roomId]);

  const handleChange = (e) => {
    setRoomData({ ...roomData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/hotels/rooms/${roomId}`, roomData);
      alert('Room updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating room:', error);
      alert('Error updating room');
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold">Edit Room</h2>
        <div>
          <label className="block text-gray-700">Category:</label>
          <input
            type="text"
            name="category"
            value={roomData.category}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Price:</label>
          <input
            type="number"
            name="price"
            value={roomData.price}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Availability:</label>
          <input
            type="number"
            name="availability"
            value={roomData.availability}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Amenities:</label>
          <textarea
            name="amenities"
            value={roomData.amenities}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Update Room
        </button>
        <button type="button" onClick={onClose} className="w-full mt-2 bg-gray-300 py-2 rounded hover:bg-gray-400">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditRoom;
