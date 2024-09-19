import React, { useState } from 'react';
import { Wifi, Tv, Wind, Coffee, Bath } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import DateSelectionModal from './DateSelectionModal';

const AmenityIcon = ({ amenity }) => {
  const icons = {
    'Free Wi-Fi': <Wifi className="h-4 w-4" />,
    'TV': <Tv className="h-4 w-4" />,
    'Air Conditioning': <Wind className="h-4 w-4" />,
    'Mini Bar': <Coffee className="h-4 w-4" />,
    'Jacuzzi': <Bath className="h-4 w-4" />
  };
  return icons[amenity] || null;
};

const RoomCard = ({ room, onBook }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleBookConfirm = (bookingDetails) => {
    onBook({ ...room, ...bookingDetails });
    setIsModalOpen(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{room.type}</CardTitle>
      </CardHeader>
      <CardContent>
        <img src={room.photo} alt={room.type} className="w-full h-48 object-cover mb-4 rounded-md" />
        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities.map((amenity, index) => (
            <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
              <AmenityIcon amenity={amenity} />
              <span className="text-sm">{amenity}</span>
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
      />
    </Card>
  );
};

export default RoomCard;
