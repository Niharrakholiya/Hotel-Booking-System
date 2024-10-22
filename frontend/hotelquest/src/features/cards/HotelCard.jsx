import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from 'lucide-react';
import AmenityIcon from '../Hotels/AmenityIcon';

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/hotels/${hotel._id}`);
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden transition-shadow duration-300 hover:shadow-lg cursor-pointer" onClick={handleBookNow}>
      <CardHeader className="p-0">
        <img 
          src={`http://localhost:5000/${hotel.photos[0]}`} 
          alt={hotel.name} 
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <CardTitle className="text-lg font-semibold">{hotel.name}</CardTitle>
            <p className="text-sm text-gray-500">{hotel.address}</p>
          </div>
          <Badge variant="secondary" className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
            {hotel.starRating}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {hotel.amenities.map((amenity) => (
            <Badge 
              key={amenity} 
              variant="outline" 
              className="flex items-center gap-1 text-xs"
            >
              <AmenityIcon amenity={amenity} />
              <span className="capitalize">{amenity}</span>
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 bg-gray-50">
        <div className="text-lg font-bold">
          ₹ {hotel.price}<span className="text-sm font-normal text-gray-500">/night</span>
        </div>
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={(e) => {
            e.stopPropagation();
            handleBookNow();
          }}
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HotelCard;