import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import axios from 'axios';
const BookingQRCode = ({ bookingDetails }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hotelName, setHotelName] = useState('');
  // Create the data to be encoded in the QR code
  useEffect(() => {
    const getHotelName = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/hotels/${bookingDetails.hotelId}`);
        setHotelName(response.data.name);
      } catch (error) {
        console.error('Error fetching hotel name:', error);
      }
    };
    getHotelName();
  }, [bookingDetails.hotelId]);

  const qrData = `
  Booking ID: ${bookingDetails._id}
  Hotel Name: ${hotelName}
  Check-in Date: ${new Date(bookingDetails.checkIn).toLocaleDateString()}
  Check-out Date: ${new Date(bookingDetails.checkOut).toLocaleDateString()}
  Number of Rooms: ${bookingDetails.numberOfRooms}
  Number of Guests: ${bookingDetails.numberOfGuests}
  Guest Name: ${bookingDetails.guestDetails[0].firstName} ${bookingDetails.guestDetails[0].lastName}
  Total Amount: ₹${bookingDetails.totalPrice.toLocaleString()}
`;

 // Function to download QR code as JPG
  const downloadQRCode = () => {
    setIsGenerating(true);
    try {
      const svg = document.getElementById('booking-qr-code');
      if (svg) {
        // Create a canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match SVG
        canvas.width = 256;
        canvas.height = 256;
        
        // Create a temporary image
        const img = new Image();
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = () => {
          // Draw image on canvas
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Convert to JPG and download
          const jpgUrl = canvas.toDataURL('image/jpeg');
          const link = document.createElement('a');
          link.href = jpgUrl;
          link.download = `booking-${bookingDetails._id}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Cleanup
          URL.revokeObjectURL(url);
          setIsGenerating(false);
        };
        
        img.src = url;
      }
    } catch (error) {
      console.error('Error generating JPG:', error);
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Booking QR Code</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="bg-white p-4 rounded-lg">
          <QRCodeSVG
            id="booking-qr-code"
            value={qrData}
            size={256}
            level="H"
            includeMargin={true}
          />
        </div>
        <Button
          onClick={downloadQRCode}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download QR Code
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookingQRCode;