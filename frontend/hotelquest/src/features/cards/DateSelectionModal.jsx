import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DateSelectionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  roomPrice,
  room,
  existingBookings = [] // Array of existing bookings for this room
}) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [error, setError] = useState('');
  const [availableRooms, setAvailableRooms] = useState(room?.capacity || 0);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCheckIn('');
      setCheckOut('');
      setGuests(1);
      setRooms(1);
      setError('');
    }
  }, [isOpen]);

  // Calculate available rooms for selected dates
  useEffect(() => {
    if (checkIn && checkOut && room) {
      const available = getAvailableRooms(checkIn, checkOut);
      setAvailableRooms(available);
      
      // Update error message if current selection exceeds new availability
      if (rooms > available) {
        setError(`Only ${available} rooms available for selected dates`);
      } else {
        setError('');
      }
    }
  }, [checkIn, checkOut, room]);

  // Function to get available rooms for a specific date range
  const getAvailableRooms = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Create array of dates between start and end
    const dateArray = [];
    let currentDate = new Date(start);
    
    while (currentDate <= end) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Check each date for bookings
    const availabilityByDate = dateArray.map(date => {
      // Count rooms booked for this date
      const bookedRooms = existingBookings.reduce((total, booking) => {
        const bookingStart = new Date(booking.checkIn);
        const bookingEnd = new Date(booking.checkOut);
        
        // If this date falls within a booking period, add booked rooms
        if (date >= bookingStart && date <= bookingEnd) {
          return total + booking.rooms;
        }
        return total;
      }, 0);

      // Return available rooms for this date
      return room.capacity - bookedRooms;
    });

    // Return minimum available rooms across all selected dates
    return Math.min(...availabilityByDate);
  };

  const calculateTotalPrice = () => {
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      return roomPrice * rooms * Math.max(nights, 1);
    }
    return 0;
  };

  const validateBooking = () => {
    setError('');

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!checkIn || !checkOut) {
      setError('Please select both check-in and check-out dates');
      return false;
    }

    if (checkInDate < today) {
      setError('Cannot book dates in the past');
      return false;
    }

    if (checkOutDate < checkInDate) {
      setError('Check-out date must be after check-in date');
      return false;
    }

    if (checkInDate.getTime() === checkOutDate.getTime()) {
      setError('Minimum stay is 1 night');
      return false;
    }

    // Check if requested rooms exceed availability
    if (rooms > availableRooms) {
      setError(`Only ${availableRooms} rooms available for selected dates`);
      return false;
    }

    const maxGuestsPerRoom = 4;
    if (guests > (rooms * maxGuestsPerRoom)) {
      setError(`Maximum ${maxGuestsPerRoom} guests allowed per room`);
      return false;
    }

    if (rooms < 1) {
      setError('Must book at least 1 room');
      return false;
    }

    return true;
  };

  const handleRoomsChange = (e) => {
    const newRooms = parseInt(e.target.value) || 0;
    setRooms(newRooms);
    
    if (newRooms > availableRooms) {
      setError(`Only ${availableRooms} rooms available for selected dates`);
    } else if (newRooms < 1) {
      setError('Must book at least 1 room');
    } else {
      setError('');
    }
  };

  const handleConfirm = () => {
    if (validateBooking()) {
      onConfirm({
        checkIn,
        checkOut,
        guests,
        rooms,
        totalPrice: calculateTotalPrice(),
      });
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Your Stay</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkIn">Check-in Date</Label>
              <Input
                id="checkIn"
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="checkOut">Check-out Date</Label>
              <Input
                id="checkOut"
                type="date"
                value={checkOut}
                min={checkIn || today}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="guests">Number of Guests</Label>
              <Input
                id="guests"
                type="number"
                min="1"
                max={rooms * 4}
                value={guests}
                onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
            <div>
              <Label htmlFor="rooms">Number of Rooms</Label>
              <Input
                id="rooms"
                type="number"
                min="1"
                max={availableRooms}
                value={rooms}
                onChange={handleRoomsChange}
              />
              {checkIn && checkOut && (
                <span className="text-sm text-gray-500 mt-1 block">
                  Available rooms for selected dates: {availableRooms}
                </span>
              )}
            </div>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div>
            <p className="text-lg font-bold">Total Price: ₹{calculateTotalPrice()}</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button 
            onClick={handleConfirm}
            disabled={!!error || !checkIn || !checkOut}
          >
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DateSelectionModal;