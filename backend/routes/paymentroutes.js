const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const auth = require('../middleware/auth-middleware');
const Booking = require('../models/booking');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order from booking
router.post('/create-order/:bookingId', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Calculate final amount including services
    const finalAmount = booking.totalPrice + booking.additionalServices.totalServicesCost;
    
    const options = {
      amount: Math.round(finalAmount * 100), // Convert to paise
      currency: 'INR',
      receipt: `booking_${booking._id}`,
      notes: {
        bookingId: booking._id.toString()
      }
    };

    const order = await razorpay.orders.create(options);
    
    // Update booking with order ID
    booking.razorpayOrderId = order.id;
    await booking.save();

    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating payment order' });
  }
});

// Verify payment and update booking
router.post('/verify-payment/:bookingId', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Update booking payment status
      booking.paymentStatus = 'completed';
      booking.razorpayPaymentId = razorpay_payment_id;
      await booking.save();

      res.json({
        status: 'success',
        message: 'Payment verified successfully',
        booking
      });
    } else {
      res.status(400).json({
        status: 'failure',
        message: 'Invalid payment signature'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
});

module.exports = router;

