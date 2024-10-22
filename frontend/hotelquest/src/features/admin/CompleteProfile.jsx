import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { amenitiesList } from './HotelDashboard';
import RoomManagement from './Roomadd';
import { MapContainer, TileLayer } from 'react-leaflet';
import LocationMarker from './LocationMarker';
import 'leaflet/dist/leaflet.css';

const CompleteProfile = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    description: '',
    address: '',
    starRating: 0,
    price: 0,
    amenities: [],
    photos: [],
  });
  const [roomData, setRoomData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const navigate = useNavigate();

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

  const handleNext = async () => {
    if (currentStep === 1) {
      try {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          if (key === 'amenities') {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else if (key === 'photos') {
            formData[key].forEach(photo => formDataToSend.append('photos', photo));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        });

        await axios.post('http://localhost:5000/api/hotels/complete-profile', formDataToSend, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setCurrentStep(2);
      } catch (error) {
        console.error('Error completing profile:', error);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleRoomDataUpdate = (rooms) => {
    setRoomData(rooms);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleSubmit = async () => {
    try {
      const hotelData = new FormData();
  
      // Check if a location is selected
      if (selectedLocation) {
        // Structure the location as expected
        const locationData = {
          type: 'Point', // Required type
          coordinates: [selectedLocation.lng, selectedLocation.lat], // Ensure coordinates are in [longitude, latitude] order
        };
        hotelData.append('location', JSON.stringify(locationData)); // Append the structured location data
      } else {
        console.error('No location selected'); // Log if no location is selected
        return; // Exit the function if no location is selected
      }
  
      // Add other necessary data to hotelData here (e.g., formData fields)
      Object.keys(formData).forEach(key => {
        if (key === 'amenities') {
          hotelData.append(key, JSON.stringify(formData[key]));
        } else if (key === 'photos') {
          formData[key].forEach(photo => hotelData.append('photos', photo));
        } else {
          hotelData.append(key, formData[key]);
        }
      });
  
      // Make API call to submit final data
      await axios.post('http://localhost:5000/api/hotels/complete-profile', hotelData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      navigate('/'); // Navigate after successful submission
    } catch (error) {
      console.error('Error completing setup:', error);
    }
  };
  

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 space-y-6">
      <Progress value={(currentStep / 3) * 100} className="w-full" />
      
      <Card>
        <CardHeader>
          <h2 className="text-3xl font-bold text-indigo-600">
            {currentStep === 1 ? 'Complete Your Hotel Profile' : 
             currentStep === 2 ? 'Add Room Details' : 
             'Select Your Hotel Location'}
          </h2>
          <p className="text-gray-500">Step {currentStep} of 3</p>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <Label htmlFor="description" className="text-lg font-semibold">Hotel Description</Label>
                <Input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
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
              </div>

              <Button
                onClick={handleNext}
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Next: Add Room Details
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <RoomManagement onRoomDataUpdate={handleRoomDataUpdate} />
              
              <div className="flex space-x-4">
                <Button
                  onClick={() => setCurrentStep(1)}
                  variant="outline"
                  className="w-1/2"
                >
                  Back to Hotel Details
                </Button>
                <Button
                  onClick={handleNext}
                  className="w-1/2 bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Next: Select Location
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Select Your Hotel Location</h3>
              <div className="h-[400px] w-full border rounded-lg overflow-hidden">
                <MapContainer 
                  center={[51.505, -0.09]} 
                  zoom={13} 
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMarker onLocationSelect={handleLocationSelect} />
                </MapContainer>
              </div>
              {selectedLocation && (
                <p className="text-sm text-gray-600">
                  Selected location: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </p>
              )}
              <Button
                onClick={handleSubmit}
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                disabled={!selectedLocation}
              >
                Complete Setup
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteProfile;