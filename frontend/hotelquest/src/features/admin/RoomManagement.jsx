import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Edit, Trash, Plus, X } from 'lucide-react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Layout from '../Layout/Layout';
const AVAILABLE_AMENITIES = [
  { id: 'wifi', label: 'WiFi' },
  { id: 'ac', label: 'Air Conditioning' },
  { id: 'tv', label: 'TV' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'parking', label: 'Parking' },
  { id: 'minibar', label: 'Mini Bar' },
  { id: 'roomService', label: 'Room Service' },
  { id: 'gym', label: 'Gym Access' },
  { id: 'pool', label: 'Pool Access' },
  { id: 'spa', label: 'Spa Access' }
];

const initialFormState = {
  roomType: '',
  pricePerNight: '',
  capacity: '',
  amenities: [],
  description: '',
  photos: [],
  roomAvailability: true
};

const RoomForm = React.memo(({ initialData, onSubmit, isEdit }) => {
  const [formData, setFormData] = useState(initialData);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);

  useEffect(() => {
    const processedData = {
      ...initialData,
      amenities: Array.isArray(initialData.amenities) 
        ? initialData.amenities 
        : (typeof initialData.amenities === 'string' 
          ? JSON.parse(initialData.amenities.replace(/\\/g, '')) 
          : [])
    };
    setFormData(processedData);

    if (processedData.photos && Array.isArray(processedData.photos)) {
      setExistingPhotos(processedData.photos);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? (value ? Number(value) : '') : value;
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleAmenityChange = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeExistingImage = (index) => {
    setExistingPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (isNaN(formData.pricePerNight) || isNaN(formData.capacity)) {
      alert('Please provide valid numbers for Price Per Night and Capacity.');
      return;
    }
  
    const submitData = new FormData();
  
    submitData.append('roomType', formData.roomType);
    submitData.append('pricePerNight', formData.pricePerNight);
    submitData.append('capacity', formData.capacity);
    submitData.append('description', formData.description);
    submitData.append('roomAvailability', formData.roomAvailability);
    submitData.append('amenities', JSON.stringify(formData.amenities));
    submitData.append('existingPhotos', JSON.stringify(existingPhotos));
  
    selectedFiles.forEach(file => {
      submitData.append('photos', file);
    });
  
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="roomType">Room Type</Label>
        <Input
          id="roomType"
          name="roomType"
          value={formData.roomType}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="pricePerNight">Price Per Night</Label>
        <Input
          id="pricePerNight"
          name="pricePerNight"
          type="number"
          value={formData.pricePerNight}
          onChange={handleInputChange}
          required
          min="0"
        />
      </div>

      <div>
        <Label htmlFor="capacity">Capacity</Label>
        <Input
          id="capacity"
          name="capacity"
          type="number"
          value={formData.capacity}
          onChange={handleInputChange}
          required
          min="1"
          max="40"
        />
      </div>

      <div className="space-y-2">
        <Label>Amenities</Label>
        <div className="grid grid-cols-2 gap-4">
          {AVAILABLE_AMENITIES.map((amenity) => (
            <div key={amenity.id} className="flex items-center space-x-2">
              <Checkbox
                id={amenity.id}
                checked={formData.amenities.includes(amenity.id)}
                onCheckedChange={() => handleAmenityChange(amenity.id)}
              />
              <Label htmlFor={amenity.id} className="cursor-pointer">
                {amenity.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="photos">Room Photos</Label>
        <Input
          id="photos"
          name="photos"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="mb-2"
        />
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          {existingPhotos.map((photo, index) => (
            <Card key={`existing-${index}`} className="relative">
              <CardContent className="p-2">
                <img
                  src={`http://localhost:5000/${photo.replace(/\\/g, '/')}`}
                  alt={`Room preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={() => removeExistingImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
          
          {previewUrls.map((url, index) => (
            <Card key={`new-${index}`} className="relative">
              <CardContent className="p-2">
                <img
                  src={url}
                  alt={`New preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={() => removeNewImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="roomAvailability">Availability</Label>
        <select
          id="roomAvailability"
          name="roomAvailability"
          value={formData.roomAvailability.toString()}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        >
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>
      </div>

      <Button type="submit" className="w-full">
        {isEdit ? 'Update Room' : 'Add Room'}
      </Button>
    </form>
  );
});

RoomForm.displayName = 'RoomForm';

const RoomCard = React.memo(({ room, onEdit, onDelete }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex justify-between items-center">
        <span>{room.roomType}</span>
        <Badge variant={room.roomAvailability ? "success" : "destructive"}>
          {room.roomAvailability ? "Available" : "Not Available"}
        </Badge>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <p><strong>Price:</strong> ${room.pricePerNight}/night</p>
        <p><strong>Capacity:</strong> {room.capacity} Rooms</p>
        <p><strong>Amenities:</strong> {room.amenities
          .map(amenityId => AVAILABLE_AMENITIES.find(a => a.id === amenityId)?.label)
          .filter(Boolean)
          .join(', ')}</p>
        <p className="line-clamp-2"><strong>Description:</strong> {room.description}</p>
        
        {room.photos && room.photos.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {room.photos.slice(0, 2).map((photo, index) => (
              <img
                key={index}
                src={`http://localhost:5000/${photo.replace(/\\/g, '/')}`}
                alt={`Room preview ${index + 1}`}
                className="w-full h-32 object-cover rounded"
              />
            ))}
          </div>
        )}
        
        <div className="flex space-x-2 mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(room)}
          >
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => onDelete(room._id)}
          >
            <Trash className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
));

RoomCard.displayName = 'RoomCard';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [error, setError] = useState('');

  const getAuthToken = useCallback(() => {
    return Cookies.get('jwt_token') || null;
  }, []);

  const fetchHotel = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication token not found');

      const response = await axios.get('https://backend-vewg.onrender.com/api/hotels/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setHotel(response.data);
      return response.data;
    } catch (err) {
      setError('Failed to load hotel information');
      console.error(err);
      return null;
    }
  }, [getAuthToken]);

  const fetchRooms = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication token not found');
      if (!hotel?._id) return;

      const response = await axios.get(`http://localhost:5000/api/hotels/${hotel._id}/rooms`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setRooms(response.data.data || response.data);
    } catch (err) {
      setError('Failed to load rooms');
      console.error(err);
    }
  }, [getAuthToken, hotel?._id]);

  useEffect(() => {
    const initializeData = async () => {
      const hotelData = await fetchHotel();
      if (hotelData) {
        fetchRooms();
      }
    };

    initializeData();
  }, [fetchHotel, fetchRooms]);

  const handleFormSubmit = async (formData) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication token not found');
      if (!hotel?._id) throw new Error('Hotel information not available');

      const url = selectedRoom 
        ? `http://localhost:5000/api/hotels/rooms/${selectedRoom._id}`
        : 'https://backend-vewg.onrender.com/api/hotels/rooms';
      
      const response = await axios({
        method: selectedRoom ? 'put' : 'post',
        url: url,
        data: formData,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      await fetchRooms();
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedRoom(null);
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to save room');
    }
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication token not found');

      await axios.delete(`http://localhost:5000/api/hotels/rooms/${roomId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      await fetchRooms();
    } catch (err) {
      setError('Failed to delete room');
      console.error(err);
    }
  };

  const handleEdit = useCallback((room) => {
    setSelectedRoom(room);
    setIsEditModalOpen(true);
  }, []);

  const getInitialFormData = useCallback((room = null) => {
    if (!room) return initialFormState;

    return {
      roomType: room.roomType,
      pricePerNight: room.pricePerNight.toString(),
      capacity: room.capacity.toString(),
      amenities: Array.isArray(room.amenities) ? room.amenities : [],
      description: room.description,
      photos: room.photos || [],
      roomAvailability: room.roomAvailability
    };
  }, []);
  return (
    <Layout>
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Room Management</h2>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
            </DialogHeader>
            <RoomForm 
              initialData={initialFormState}
              onSubmit={handleFormSubmit}
              isEdit={false}
            />
          </DialogContent>
        </Dialog>
      </div>

      {!hotel && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <AlertCircle className="inline mr-2" /> Loading hotel information...
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <AlertCircle className="inline mr-2" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <RoomCard
            key={room._id}
            room={room}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>


      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
          </DialogHeader>
          <RoomForm 
            initialData={getInitialFormData(selectedRoom)}
            onSubmit={handleFormSubmit}
            isEdit={true}
          />
        </DialogContent>
      </Dialog>
    </div>
    </Layout>
  );
};

export default RoomManagement;