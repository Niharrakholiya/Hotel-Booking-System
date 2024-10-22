import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Cookies from 'js-cookie';

const PaymentComponent = ({ bookingId, totalAmount, guestDetails, onPaymentSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      // Load Razorpay script
      const scriptLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Create Razorpay order
      const orderResponse = await fetch(`http://localhost:5000/api/payment/create-order/${bookingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('jwt_token')}`
        }
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order');
      }

      const orderData = await orderResponse.json();

      // Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Hotel Booking',
        description: `Booking ID: ${bookingId}`,
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await fetch(`http://localhost:5000/api/payment/verify-payment/${bookingId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('jwt_token')}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            const verifyData = await verifyResponse.json();
            toast.success('Payment successful!');
            onPaymentSuccess(verifyData.booking);
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.');
            console.error('Payment verification error:', error);
          }
        },
        prefill: {
          name: `${guestDetails[0].firstName} ${guestDetails[0].lastName}`,
          email: guestDetails[0].email,
          contact: guestDetails[0].phone
        },
        theme: {
          color: '#2563eb'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast.error(error.message || 'Payment initialization failed');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isProcessing}
      className="w-full"
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing Payment...
        </>
      ) : (
        `Pay ₹${totalAmount.toLocaleString()}`
      )}
    </Button>
  );
};

export default PaymentComponent;
