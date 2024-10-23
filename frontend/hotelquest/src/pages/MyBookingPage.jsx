import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Bed, Clock, IndianRupee, Car, Map } from 'lucide-react';
import Cookies from 'js-cookie'; // Import js-cookie
import Layout from '@/features/Layout/Layout';
const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = Cookies.get('jwt_token'); // Get token from js-cookie
      const response = await fetch('http://localhost:5000/api/booking/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}` // Use token from Cookies
        }
      });
      const data = await response.json();
      setBookings(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Layout>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      
      <div className="grid gap-6">
        {bookings.map((booking) => (
          <Card key={booking._id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">
                  {booking.hotel.name}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(booking.bookingStatus)}>
                    {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                  </Badge>
                  <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                    {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span>{booking.hotel.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-gray-500" />
                    <span>{booking.room.roomType} - {booking.numberOfRooms} room(s)</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span>{booking.numberOfGuests} guests</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span>{format(new Date(booking.checkIn), 'MMM dd, yyyy')} - {format(new Date(booking.checkOut), 'MMM dd, yyyy')}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-5 w-5 text-gray-500" />
                    <span>₹{booking.pricePerNight}/night</span>
                  </div>
                  
                  {booking.additionalServices.taxiServiceCount > 0 && (
                    <div className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-gray-500" />
                      <span>Taxi Service ({booking.additionalServices.taxiServiceCount})</span>
                    </div>
                  )}
                  
                  {booking.additionalServices.guideServiceCount > 0 && (
                    <div className="flex items-center gap-2">
                      <Map className="h-5 w-5 text-gray-500" />
                      <span>Guide Service ({booking.additionalServices.guideServiceCount})</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span>Booked on {format(new Date(booking.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total Amount:</span>
                      <span>₹{booking.totalPrice + booking.additionalServices.totalServicesCost}</span>
                    </div>
                  </div>
                </div>
              </div>

              {booking.guestDetails && booking.guestDetails.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">Guest Details</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {booking.guestDetails.map((guest, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="font-medium">{guest.firstName} {guest.lastName}</div>
                        <div className="text-sm text-gray-600">
                          <div>Age: {guest.age}</div>
                          <div>Gender: {guest.gender}</div>
                          <div>Phone: {guest.phone}</div>
                          <div>Email: {guest.email}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </Layout>
  );
};

export default MyBookings;
