const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Room = require('../models/room');
const Customer = require('../models/customer');
const auth = require('../middleware/auth-middleware');

// Helper function for error responses
const handleError = (res, error, message = 'Something went wrong', status = 400) => {
  console.error(error); // Optional: Log the error for debugging purposes
  return res.status(status).json({ message });
};

// Create a new booking
router.post('/', auth, async (req, res) => {
  const {
    hotelId,
    roomId,
    checkIn,
    checkOut,
    numberOfRooms,
    numberOfGuests,
    guestDetails,
    pricePerNight,
    totalPrice
  } = req.body;

  try {
    // Check if customer exists or create a new one
    let customer = await Customer.findOne({ user: req.user._id });
    if (!customer) {
      const firstGuest = guestDetails[0];
      customer = new Customer({
        user: req.user._id,
        name: `${firstGuest.firstName} ${firstGuest.lastName}`,
        phone_no: firstGuest.phone,
        address: 'Address pending'
      });
      await customer.save();
    }

    // Verify room availability
    const room = await Room.findById(roomId);
    if (!room || !room.roomAvailability) {
      return res.status(400).json({ message: 'Room not available' });
    }

    // Create booking
    const booking = new Booking({
      customer: customer._id,
      hotel: hotelId,
      room: roomId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      numberOfRooms,
      numberOfGuests,
      guestDetails,
      pricePerNight,
      totalPrice
    });

    await booking.save();

    // Update customer history
    customer.history.push(booking._id);
    await customer.save();

    res.status(201).json(booking);
  } catch (error) {
    return handleError(res, error);
  }
});

// Get all bookings for a user
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const customer = await Customer.findOne({ user: req.user._id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const bookings = await Booking.find({ customer: customer._id })
      .populate('hotel', 'name address')
      .populate('room', 'roomType')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    return handleError(res, error, 'Failed to retrieve bookings', 500);
  }
});

// Get specific booking details
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hotel', 'name address photos')
      .populate('room', 'roomType amenities')
      .populate('customer', 'name phone_no');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify user owns this booking
    const customer = await Customer.findOne({ user: req.user._id });
    if (booking.customer.toString() !== customer._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    return handleError(res, error, 'Failed to retrieve booking details', 500);
  }
});

// Update booking status
router.patch('/:id/status', auth, async (req, res) => {
  const { bookingStatus } = req.body;

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify user owns this booking
    const customer = await Customer.findOne({ user: req.user._id });
    if (booking.customer.toString() !== customer._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.bookingStatus = bookingStatus;
    await booking.save();

    res.json(booking);
  } catch (error) {
    return handleError(res, error);
  }
});

// Cancel booking
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify user owns this booking
    const customer = await Customer.findOne({ user: req.user._id });
    if (booking.customer.toString() !== customer._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if cancellation is allowed
    const today = new Date();
    const checkIn = new Date(booking.checkIn);
    const daysDifference = Math.ceil((checkIn - today) / (1000 * 60 * 60 * 24));

    if (daysDifference < 1) {
      return res.status(400).json({ message: 'Cannot cancel booking within 24 hours of check-in' });
    }

    booking.bookingStatus = 'cancelled';
    await booking.save();

    res.json(booking);
  } catch (error) {
    return handleError(res, error);
  }
});

module.exports = router;
