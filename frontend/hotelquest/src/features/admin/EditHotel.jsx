import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditHotel = ({ hotelId, onClose, onUpdate }) => {
  const [hotelData, setHotelData] = useState({
    name: '',
    location: '',
    amenities: [],
    photos: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/hotels/me`);
        setHotelData(response.data);
      } catch (error) {
        setError('Error fetching hotel data. Please try again.');
        console.error('Error fetching hotel data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotelData();
  }, [hotelId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'amenities') {
      // Convert comma-separated string to array
      setHotelData(prev => ({
        ...prev,
        [name]: value.split(',').map(item => item.trim())
      }));
    } else {
      setHotelData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', hotelData.name);
      formData.append('location', hotelData.location);
      formData.append('amenities', JSON.stringify(hotelData.amenities));
      
      files.forEach(file => {
        formData.append('photos', file);
      });

      await axios.put('/api/hotels/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onUpdate && onUpdate();
      onClose();
    } catch (error) {
      setError('Error updating hotel. Please try again.');
      console.error('Error updating hotel:', error);
    }
  };

  if (loading) return <div className="modal-overlay"><div className="modal-content">Loading...</div></div>;
  if (error) return <div className="modal-overlay"><div className="modal-content text-red-500">{error}</div></div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold">Edit Hotel</h2>
          
          <div>
            <label className="block text-gray-700 mb-1">Hotel Name:</label>
            <input
              type="text"
              name="name"
              value={hotelData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Location:</label>
            <input
              type="text"
              name="location"
              value={hotelData.location}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Amenities (comma-separated):</label>
            <input
              type="text"
              name="amenities"
              value={hotelData.amenities.join(', ')}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="WiFi, Pool, Gym"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Photos:</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              accept="image/*"
            />
          </div>

          {hotelData.photos.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Current Photos:</p>
              <div className="grid grid-cols-3 gap-2">
                {hotelData.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Hotel photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Update Hotel
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHotel;