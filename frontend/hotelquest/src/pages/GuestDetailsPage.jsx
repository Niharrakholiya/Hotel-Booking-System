import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '@/features/Layout/Layout';
import GuestForm from '../features/Hotels/GuestForm';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2, CheckCircle2 } from "lucide-react";
import Cookies from 'js-cookie';
import PaymentComponent from './PayementPage';
import BookingQRCode from './BookingQRCode';

const GuestDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState(null);
  const bookingData = location.state?.bookingData;
  console.log(location.state);
  const [showPayment, setShowPayment] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);

  // Redirect if no booking data
  if (!bookingData) {
    navigate('/');
    return null;
  }

  const form = useForm({
    defaultValues: {
      guests: Array(bookingData.numberOfGuests).fill({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: '',
        age: '',
        taxiService: false,
        guideService: false
      })
    }
  });
  const token = Cookies.get('jwt_token');

  const createBooking = async (bookingData, guestData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await fetch('http://localhost:5000/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          hotelId: bookingData.hotelId,
          roomId: bookingData.roomId,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          numberOfRooms: bookingData.numberOfRooms,
          numberOfGuests: bookingData.numberOfGuests,
          guestDetails: guestData.guests,
          pricePerNight: bookingData.pricePerNight,
          totalPrice: calculateTotalPrice(bookingData, guestData.guests),
          paymentStatus: 'completed',
          bookingStatus: 'confirmed'
        })
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create booking');
      }
  
      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  const handlePaymentSuccess = (confirmedBooking) => {
    setConfirmedBookingId(confirmedBooking._id);
    setBookingConfirmed(true);
  };
  
  const calculateTotalPrice = (bookingData, guests) => {
    const roomCost = bookingData.totalPrice;
    const servicesCost = guests.reduce((total, guest) => {
      let guestServices = 0;
      if (guest.taxiService) guestServices += 2000;
      if (guest.guideService) guestServices += 2000;
      return total + guestServices;
    }, 0);
    
    return roomCost + servicesCost;
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch('http://localhost:5000/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('jwt_token')}`
        },
        body: JSON.stringify({
          hotelId: bookingData.hotelId,
          roomId: bookingData.roomId,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          numberOfRooms: bookingData.numberOfRooms,
          numberOfGuests: bookingData.numberOfGuests,
          guestDetails: data.guests,
          pricePerNight: bookingData.pricePerNight,
          totalPrice: calculateTotalPrice(bookingData, data.guests),
          paymentStatus: 'pending',
          bookingStatus: 'confirmed'
        })
      });
      if (!response.ok) {
        throw new Error('Failed to create booking');
      }
  
      const booking = await response.json();
      setCurrentBooking(booking);
      setShowPayment(true);
      
    } catch (error) {
      toast.error(error.message || "Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleViewBookings = () => {
    navigate('/my-bookings');
  };

  const handleBack = () => {
    navigate(-1);
  };
  console.log(bookingData);
  if (bookingConfirmed) {
    return (
      <Layout>
        <ToastContainer />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
              <p className="text-gray-600 mb-2">Your booking has been successfully confirmed.</p>
              <p className="text-gray-600 mb-6">Booking ID: {confirmedBookingId}</p>
            </div>
            
            <div className="grid grid-cols-2  mb-8">
  {/* Booking Details Section */}
  <div className="bg-gray-50 p-6 rounded-lg text-left">
    <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
    <div className="grid gap-4">
      <div>
        <p className="text-gray-600">Hotel</p>
        <p className="font-medium">{bookingData.hotelName}</p>
      </div>
      <div>
        <p className="text-gray-600">Room Type</p>
        <p className="font-medium">{bookingData.roomType}</p>
      </div>
      <div>
        <p className="text-gray-600">Check-in Date</p>
        <p className="font-medium">{new Date(bookingData.checkIn).toLocaleDateString()}</p>
      </div>
      <div>
        <p className="text-gray-600">Check-out Date</p>
        <p className="font-medium">{new Date(bookingData.checkOut).toLocaleDateString()}</p>
      </div>
      <div>
        <p className="text-gray-600">Total Amount</p>
        <p className="font-medium">₹{calculateTotalPrice(bookingData, form.getValues().guests).toLocaleString()}</p>
      </div>
    </div>
  </div>

  {/* QR Code Section */}
  <div className="flex items-center justify-center bg-gray-50 p-6 rounded-lg">
    <BookingQRCode
      bookingDetails={{
        _id: confirmedBookingId,
        hotelId: bookingData.hotelId,
        hotelName: bookingData.hotelName,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        numberOfRooms: bookingData.numberOfRooms,
        numberOfGuests: bookingData.numberOfGuests,
        guestDetails: form.getValues().guests,
        totalPrice: calculateTotalPrice(bookingData, form.getValues().guests)
      }}
    />
  </div>
</div>

            <div className="flex justify-center gap-4">
              <Button onClick={handleViewBookings}>
                View My Bookings
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Rest of the component remains the same...
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Guest Details</h1>
          
          {/* Booking Summary */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Room Type</p>
                <p className="font-medium">{bookingData.roomType}</p>
              </div>
              <div>
                <p className="text-gray-600">Number of Rooms</p>
                <p className="font-medium">{bookingData.numberOfRooms}</p>
              </div>
              <div>
                <p className="text-gray-600">Check-in Date</p>
                <p className="font-medium">{new Date(bookingData.checkIn).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Check-out Date</p>
                <p className="font-medium">{new Date(bookingData.checkOut).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Price per Night</p>
                <p className="font-medium">₹{bookingData.pricePerNight.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Room Total</p>
                <p className="font-medium">₹{bookingData.totalPrice.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Guest Forms */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {Array.from({ length: bookingData.numberOfGuests }).map((_, index) => (
                <GuestForm 
                  key={index} 
                  index={index} 
                  form={form}
                />
              ))}
              
              {/* Total Price Summary */}
              <div className="bg-gray-50 p-4 rounded-lg mt-6">
                <h3 className="text-lg font-semibold mb-2">Total Price Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Room Total:</span>
                    <span>₹{bookingData.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Additional Services:</span>
                    <span>₹{(calculateTotalPrice(bookingData, form.getValues().guests) - bookingData.totalPrice).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Final Total:</span>
                    <span>₹{calculateTotalPrice(bookingData, form.getValues().guests).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                {!showPayment ? (
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </Button>
                ) : (
                  <PaymentComponent
                    bookingId={currentBooking._id}
                    totalAmount={currentBooking.totalPrice + currentBooking.additionalServices.totalServicesCost}
                    guestDetails={currentBooking.guestDetails}
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default GuestDetailsPage;