import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, Tv, Wind, Coffee, Bath } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import DateSelectionModal from './DateSelectionModal';

const getDisplayName = (amenityKey) => {
  const nameMap = {
    'wifi': 'Free Wi-Fi',
    'minibar': 'Mini Bar',
    'roomService': 'Room Service',
    'tv': 'TV',
    'airConditioning': 'Air Conditioning',
    'jacuzzi': 'Jacuzzi'
  };
  return nameMap[amenityKey] || amenityKey;
};

const AmenityIcon = ({ amenityKey }) => {
  const iconMap = {
    'wifi': <Wifi className="h-4 w-4" />,
    'tv': <Tv className="h-4 w-4" />,
    'airConditioning': <Wind className="h-4 w-4" />,
    'minibar': <Coffee className="h-4 w-4" />,
    'jacuzzi': <Bath className="h-4 w-4" />,
    'roomService': <Coffee className="h-4 w-4" />
  };
  return iconMap[amenityKey] || null;
};

const RoomCard = ({ room, hotelId }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleBookConfirm = (bookingDetails) => {
    // Prepare booking data
    const bookingData = {
      hotelId,
      roomId: room._id,
      roomType: room.type,
      checkIn: bookingDetails.checkIn,
      checkOut: bookingDetails.checkOut,
      numberOfGuests: bookingDetails.guests,
      numberOfRooms: bookingDetails.rooms,
      totalPrice: bookingDetails.totalPrice,
      pricePerNight: room.price
    };

    // Encode booking data to pass via URL state
    navigate('/booking/guest-details', { 
      state: { bookingData }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{room.type}</CardTitle>
      </CardHeader>
      <CardContent>
        <img src={room.photo} alt={room.type} className="w-full h-48 object-cover mb-4 rounded-md" />
        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities.map((amenityKey, index) => (
            <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
              <AmenityIcon amenityKey={amenityKey} />
              <span className="text-sm">{getDisplayName(amenityKey)}</span>
            </div>
          ))}
        </div>
        <p className="text-lg font-bold">₹{room.price} / night</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleBookClick} className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300">
          Book Now
        </Button>
      </CardFooter>
      <DateSelectionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleBookConfirm}
        roomPrice={room.price}
        room={room}
      />
    </Card>
  );
};

export default RoomCard;