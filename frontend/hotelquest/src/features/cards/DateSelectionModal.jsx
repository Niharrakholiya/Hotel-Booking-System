import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DateSelectionModal = ({ isOpen, onClose, onConfirm, roomPrice }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);

  const calculateTotalPrice = () => {
    if (checkIn && checkOut) {
      const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
      return roomPrice * rooms * nights;
    }
    return 0;
  };

  const handleConfirm = () => {
    onConfirm({
      checkIn,
      checkOut,
      guests,
      rooms,
      totalPrice: calculateTotalPrice(),
    });
  };

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
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="checkOut">Check-out Date</Label>
              <Input
                id="checkOut"
                type="date"
                value={checkOut}
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
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="rooms">Number of Rooms</Label>
              <Input
                id="rooms"
                type="number"
                min="1"
                value={rooms}
                onChange={(e) => setRooms(parseInt(e.target.value))}
              />
            </div>
          </div>
          <div>
            <p className="text-lg font-bold">Total Price: ₹{calculateTotalPrice()}</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={handleConfirm}>Confirm Booking</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DateSelectionModal;