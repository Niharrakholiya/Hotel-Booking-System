import React, { useState, useEffect } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';

const MAX_ROOMS_PER_CATEGORY = 40;

const RoomManagement = ({ hotelId,onRoomDataUpdate }) => {
  const [rooms, setRooms] = useState([]);
  const [errors, setErrors] = useState({}); // Added errors state
  const [newRoom, setNewRoom] = useState({
    category: '',
    photos: [],
    amenities: [],
    price: '',
    description: '',
    availability: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, [hotelId]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching rooms...');
      const response = await axios.get('http://localhost:5000/api/hotels/rooms', {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Received response:', response.data);
      setRooms(response.data);
      onRoomDataUpdate(response.data);
    } catch (error) {
      console.error('Detailed error fetching rooms:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      setError(error.response?.data?.error || 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom(prev => ({ ...prev, [name]: value }));
    // Clear the specific error when the user starts typing
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewRoom(prev => ({ ...prev, photos: [...prev.photos, ...files] }));
    setErrors(prev => ({ ...prev, photos: '' }));
  };

  const handleAmenityAdd = () => {
    const amenity = document.getElementById('amenityInput').value;
    if (amenity) {
      setNewRoom(prev => ({ ...prev, amenities: [...prev.amenities, amenity] }));
      document.getElementById('amenityInput').value = '';
      setErrors(prev => ({ ...prev, amenities: '' }));
    }
  };

  const handleAmenityRemove = (index) => {
    setNewRoom(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    let formErrors = {};

    if (!newRoom.category.trim()) formErrors.category = 'Category is required';
    if (newRoom.photos.length === 0) formErrors.photos = 'At least one photo is required';
    if (newRoom.amenities.length === 0) formErrors.amenities = 'At least one amenity is required';
    if (!newRoom.price) formErrors.price = 'Price is required';
    else if (isNaN(newRoom.price) || Number(newRoom.price) <= 0) formErrors.price = 'Price must be a positive number';
    if (!newRoom.description) formErrors.description = 'Description is required';
    else if (newRoom.description.length < 20) formErrors.description = 'Description must be at least 20 characters long';
    if (!newRoom.availability) formErrors.availability = 'Availability is required';
    else if (isNaN(newRoom.availability) || Number(newRoom.availability) < 0) formErrors.availability = 'Availability must be a non-negative number';
    else if (Number(newRoom.availability) > MAX_ROOMS_PER_CATEGORY) formErrors.availability = `Maximum ${MAX_ROOMS_PER_CATEGORY} rooms allowed per category`;

    const existingCategory = rooms.find(room => room.category.toLowerCase() === newRoom.category.toLowerCase());
    if (existingCategory) {
      const totalRooms = Number(existingCategory.availability) + Number(newRoom.availability);
      if (totalRooms > MAX_ROOMS_PER_CATEGORY) {
        formErrors.availability = `Total rooms for ${newRoom.category} cannot exceed ${MAX_ROOMS_PER_CATEGORY}. Current total: ${existingCategory.availability}`;
      }
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const formData = new FormData();
        formData.append('category', newRoom.category);
        formData.append('price', newRoom.price);
        formData.append('description', newRoom.description);
        formData.append('availability', newRoom.availability);
        formData.append('amenities', JSON.stringify(newRoom.amenities));
        newRoom.photos.forEach((photo, index) => {
          formData.append(`photos`, photo);
        });

        await axios.post('http://localhost:5000/api/hotels/rooms', formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        fetchRooms();
        setNewRoom({
          category: '',
          photos: [],
          amenities: [],
          price: '',
          description: '',
          availability: 0,
        });
        setErrors({}); // Clear all errors after successful submission
      } catch (error) {
        console.error('Error adding/updating room:', error);
        setErrors(prev => ({
          ...prev,
          submit: error.response?.data?.error || 'Failed to add/update room'
        }));
      }
    }
  };

  const handleAvailabilityChange = async (roomId, change) => {
    try {
      const updatedRooms = rooms.map(room => 
        room._id === roomId
          ? { ...room, availability: Math.max(0, Math.min(MAX_ROOMS_PER_CATEGORY, room.availability + change)) }
          : room
      );

      setRooms(updatedRooms);
      onRoomDataUpdate(updatedRooms); // Update parent component

      await axios.put(`http://localhost:5000/api/hotels/rooms/${roomId}`, {
        availability: updatedRooms.find(room => room._id === roomId).availability
      }, { withCredentials: true });
    } catch (error) {
      console.error('Error updating room availability:', error);
      fetchRooms(); // Refetch rooms to ensure consistency with server state
      setError('Failed to update room availability');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      {errors.submit && (
        <Alert variant="destructive">
          <AlertDescription>{errors.submit}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">Room Category</label>
          <Input
            name="category"
            value={newRoom.category}
            onChange={handleInputChange}
            placeholder="Enter room category"
          />
          {errors.category && <Alert variant="destructive"><AlertDescription>{errors.category}</AlertDescription></Alert>}
        </div>

        <div>
          <label className="block mb-2">Room Photos</label>
          <Input type="file" multiple onChange={handlePhotoUpload} accept="image/*" />
          <div className="mt-2 flex flex-wrap gap-2">
            {newRoom.photos.map((photo, index) => (
              <div key={index} className="relative">
                <img src={URL.createObjectURL(photo)} alt={`Room ${index + 1}`} className="w-20 h-20 object-cover" />
                <button
                  type="button"
                  onClick={() => setNewRoom(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }))}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          {errors.photos && <Alert variant="destructive"><AlertDescription>{errors.photos}</AlertDescription></Alert>}
        </div>

        <div>
          <label className="block mb-2">Room Amenities</label>
          <div className="flex gap-2 mb-2">
            <Input id="amenityInput" placeholder="Add amenity" />
            <Button type="button" onClick={handleAmenityAdd}>
              <PlusCircle className="mr-2" size={16} />
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {newRoom.amenities.map((amenity, index) => (
              <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                <span>{amenity}</span>
                <button type="button" onClick={() => handleAmenityRemove(index)} className="ml-2 text-red-500">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          {errors.amenities && <Alert variant="destructive"><AlertDescription>{errors.amenities}</AlertDescription></Alert>}
        </div>

        <div>
          <label className="block mb-2">Room Price (per night)</label>
          <Input
            type="number"
            name="price"
            value={newRoom.price}
            onChange={handleInputChange}
            placeholder="Enter price"
          />
          {errors.price && <Alert variant="destructive"><AlertDescription>{errors.price}</AlertDescription></Alert>}
        </div>

        <div>
          <label className="block mb-2">Room Description</label>
          <Textarea
            name="description"
            value={newRoom.description}
            onChange={handleInputChange}
            placeholder="Enter room description"
            rows={4}
          />
          {errors.description && <Alert variant="destructive"><AlertDescription>{errors.description}</AlertDescription></Alert>}
        </div>

        <div>
          <label className="block mb-2">Number of Rooms Available</label>
          <Input
            type="number"
            name="availability"
            value={newRoom.availability}
            onChange={handleInputChange}
            placeholder="Enter number of rooms"
          />
          {errors.availability && <Alert variant="destructive"><AlertDescription>{errors.availability}</AlertDescription></Alert>}
        </div>

        <Button type="submit" className="w-full">Add/Update Room Category</Button>
      </form> 

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Room Inventory</h2>
        {rooms.map((room) => (
          <div key={room._id} className="border p-4 rounded-lg mb-4">
            <h3 className="font-bold">{room.category}</h3>
            <p>Price: ${room.price} per night</p>
            <p>Amenities: {room.amenities.join(', ')}</p>
            <p>{room.description}</p>
            <div className="mt-2">
              <p>Available Rooms: {room.availability}</p>
              <div className="flex gap-2 mt-1">
                <Button onClick={() => handleAvailabilityChange(room._id, -1)} disabled={room.availability === 0}>-</Button>
                <Button onClick={() => handleAvailabilityChange(room._id, 1)} disabled={room.availability === MAX_ROOMS_PER_CATEGORY}>+</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomManagement;
      

      