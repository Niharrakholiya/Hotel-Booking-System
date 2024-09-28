import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Wifi, Coffee, CarIcon} from 'lucide-react';
import PoolIcon from '@mui/icons-material/Pool';
import axios from 'axios';
axios.defaults.withCredentials = true;

const amenitiesList = [
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
    photos: []
  });

  useEffect(() => {
    console.log("Fetching hotel details on component mount...");
    fetchHotelDetails();
  }, []);

  const fetchHotelDetails = async () => {
    try {
      console.log('Sending cookies:', document.cookie);
      console.log("Making GET request to fetch hotel details...");
      const response = await axios.get('http://localhost:5000/api/hotels/me', {
        withCredentials: true,
      });
      console.log("Response from hotel details fetch:", response.data);
      
      const data = response.data;
      setHotel(data);
      setFormData({
        starRating: data.starRating || 0,
        price: data.price || 0,
        amenities: data.amenities || [],
        photos: data.photos || [],
      });
    } catch (error) {
      console.error('Error fetching hotel details:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenity) => {
    console.log(`Amenity toggled: ${amenity}`);
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    console.log("Files uploaded:", files);
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      console.log("Form submitted. Preparing data to send...");
      const formDataToSend = new FormData();
      formDataToSend.append('starRating', formData.starRating);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('amenities', JSON.stringify(formData.amenities));
      formData.photos.forEach((photo) => formDataToSend.append('photos', photo));

      console.log("Sending PUT request to update hotel details...");
      const response = await axios.put('http://localhost:5000/api/hotels/update', formDataToSend, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log("Response from update:", response);
      if (response.status === 200) {
        console.log("Hotel details updated successfully");
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
        <h2 className="text-2xl font-bold">{hotel.name} Dashboard</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="starRating">HRACC Star Rating</Label>
            <Input
              type="number"
              id="starRating"
              name="starRating"
              value={formData.starRating}
              onChange={handleInputChange}
              min="0"
              max="5"
            />
          </div>
          <div>
            <Label htmlFor="price">Price per Night</Label>
            <Input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
            />
          </div>
          <div>
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 gap-4">
              {amenitiesList.map((amenity) => (
                <div key={amenity.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity.name}
                    checked={formData.amenities.includes(amenity.name)}
                    onCheckedChange={() => handleAmenityChange(amenity.name)}
                  />
                  <Label htmlFor={amenity.name} className="flex items-center">
                    <amenity.icon className="w-4 h-4 mr-2" />
                    {amenity.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="photos">Upload Photos</Label>
            <Input
              type="file"
              id="photos"
              name="photos"
              onChange={handlePhotoUpload}
              multiple
              accept="image/*"
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
          </div>
          {formData.photos.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {formData.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo instanceof File ? URL.createObjectURL(photo) : photo}
                  alt={`Hotel photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
              ))}
            </div>
          )}
          <Button type="submit" className="w-full">Update Hotel Information</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HotelDashboard;
