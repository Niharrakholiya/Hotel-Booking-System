import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../Layout/Layout';
const HotelManagement = () => {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    starRating: '',
    price: '',
    amenities: [],
    profileCompleted: false
  });

  const AMENITIES_OPTIONS = [
    'WiFi', 'Parking', 'Pool', 'Gym', 'Restaurant', 'Room Service',
    'Spa', 'Bar', 'Business Center', 'Airport Shuttle', '24/7 Front Desk',
    'Laundry Service', 'Pet Friendly', 'Conference Rooms'
  ];

  const STAR_RATINGS = [1, 2, 3, 4, 5];

  const fetchHotelData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://backend-vewg.onrender.com/api/hotels/me');
      const hotelData = {
        ...response.data,
        amenities: response.data.amenities || [],
        photos: response.data.photos || [],
      };
      setHotel(hotelData);
      setFormData({
        name: hotelData.name || '',
        description: hotelData.description || '',
        address: hotelData.address || '',
        starRating: hotelData.starRating || '',
        price: hotelData.price || '',
        amenities: hotelData.amenities || [],
        profileCompleted: hotelData.profileCompleted || false
      });
      setError(null);
    } catch (error) {
      console.error('Error fetching hotel:', error);
      setError('Failed to load hotel data. Please try again later.');
      setHotel(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/hotels/${hotel._id}`, formData);
      await fetchHotelData();
    } catch (error) {
      console.error('Error updating hotel:', error);
      setError('Failed to update hotel. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAmenityChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      amenities: e.target.checked
        ? [...prev.amenities, value]
        : prev.amenities.filter(item => item !== value)
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
          <button 
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={fetchHotelData}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout>
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Hotel Management</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hotel Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 h-32"
                placeholder="Describe your hotel..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Star Rating
                </label>
                <select
                  value={formData.starRating}
                  onChange={(e) => setFormData(prev => ({ ...prev, starRating: Number(e.target.value) }))}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Rating</option>
                  {STAR_RATINGS.map(rating => (
                    <option key={rating} value={rating}>
                      {rating} {rating === 1 ? 'Star' : 'Stars'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Night
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 gap-2">
                {AMENITIES_OPTIONS.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onChange={handleAmenityChange}
                      className="rounded text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {hotel?.photos?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Photos
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {hotel.photos.map((photo, index) => (
                    <img 
                      key={index}
                      src={`http://localhost:5000/${photo}`} 
                      alt={`Hotel photo ${index + 1}`} 
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Status
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.profileCompleted}
                  onChange={(e) => setFormData(prev => ({ ...prev, profileCompleted: e.target.checked }))}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Mark profile as complete</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>

          {hotel?.location && (
            <div className="text-sm text-gray-600">
              Location: {hotel.location.coordinates[1]}, {hotel.location.coordinates[0]}
              <span className="ml-2 text-gray-400">(Fixed)</span>
            </div>
          )}
        </div>
      </form>
    </div>
    </Layout>
  );
};

export default HotelManagement;