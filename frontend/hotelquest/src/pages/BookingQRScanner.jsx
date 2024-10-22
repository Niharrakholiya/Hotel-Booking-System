import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const BookingQRScanner = ({ bookingData }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Booking Details</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Hotel Information</h3>
              <p className="text-gray-600">{bookingData.hotelName}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg">Stay Details</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Check-in</p>
                  <p>{bookingData.checkIn}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-out</p>
                  <p>{bookingData.checkOut}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rooms</p>
                  <p>{bookingData.numberOfRooms}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Guests</p>
                  <p>{bookingData.numberOfGuests}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Guest Information</h3>
              <p className="text-gray-600">{bookingData.guestName}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Payment Details</h3>
              <p className="text-gray-600">Total Amount: ₹{bookingData.totalAmount.toLocaleString()}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Booking Reference</h3>
              <p className="text-gray-600">{bookingData.bookingId}</p>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default BookingQRScanner;