// HotelDashboard.js
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Wifi, Coffee, CarIcon } from 'lucide-react';
import PoolIcon from '@mui/icons-material/Pool';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Updated import for routing

axios.defaults.withCredentials = true;
export const amenitiesList = [
  { name: 'wifi', icon: Wifi, label: 'Wi-Fi' },
  { name: 'parking', icon: CarIcon, label: 'Parking' },
  { name: 'pool', icon: PoolIcon, label: 'Swimming Pool' },
  { name: 'restaurant', icon: Coffee, label: 'Restaurant' },
];

const HotelDashboard = () => {
  const [hotel, setHotel] = useState(null);
  const [formData, setFormData] = useState({
    starRating: 0,
    price: 0,
    amenities: [],
    photos: [],
  });
  const navigate = useNavigate(); // Updated for react-router-dom

  useEffect(() => {
    fetchHotelDetails();
  }, []);

  const fetchHotelDetails = async () => {
    try {
      const response = await axios.get('https://backend-vewg.onrender.com/api/hotels/me', { withCredentials: true });
      const data = response.data;

      if (!data.profileCompleted) {
        navigate('/complete-profile'); // Redirect to complete profile page if incomplete
      } else {
        setHotel(data);
        setFormData({
          starRating: data.starRating || 0,
          price: data.price || 0,
          amenities: data.amenities || [],
          photos: data.photos || [],
        });
      }
    } catch (error) {
      console.error('Error fetching hotel details:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('starRating', formData.starRating);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('amenities', JSON.stringify(formData.amenities));
      formData.photos.forEach((photo) => formDataToSend.append('photos', photo));

      const response = await axios.put('https://backend-vewg.onrender.com/api/hotels/update', formDataToSend, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        fetchHotelDetails();
      }
    } catch (error) {
      console.error('Error updating hotel:', error);
    }
  };

  if (!hotel) return <div>Loading...</div>;

  return (
    <Card className="w-full max-w-2xl mx-auto mt-10">
      <CardHeader>
        <h2 className="text-3xl font-bold text-indigo-600">{hotel.name} Dashboard</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <Label htmlFor="starRating" className="text-lg font-semibold">HRACC Star Rating</Label>
            <Input
              type="number"
              id="starRating"
              name="starRating"
              value={formData.starRating}
              onChange={handleInputChange}
              min="0"
              max="5"
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <Label htmlFor="price" className="text-lg font-semibold">Price per Night</Label>
            <Input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <Label className="text-lg font-semibold">Amenities</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {amenitiesList.map((amenity) => (
                <div key={amenity.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity.name}
                    checked={formData.amenities.includes(amenity.name)}
                    onCheckedChange={() => handleAmenityChange(amenity.name)}
                  />
                  <Label htmlFor={amenity.name} className="flex items-center">
                    <amenity.icon className="w-5 h-5 mr-2 text-gray-600" />
                    {amenity.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="photos" className="text-lg font-semibold">Upload Photos</Label>
            <Input
              type="file"
              id="photos"
              name="photos"
              onChange={handlePhotoUpload}
              multiple
              accept="image/*"
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
            />
          </div>
          {formData.photos.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {formData.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo instanceof File ? URL.createObjectURL(photo) : photo}
                  alt={`Hotel photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded shadow-sm"
                />
              ))}
            </div>
          )}
          <Button type="submit" className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
            Update Hotel Information
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HotelDashboard;
