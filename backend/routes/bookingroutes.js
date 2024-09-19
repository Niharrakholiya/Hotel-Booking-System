const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Room = require('../models/room');

router.post('/', async (req, res) => {
  try {
    const { userId, roomId, checkInDate, checkOutDate } = req.body;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    const booking = new Booking({
      user: userId,
      room: roomId,
      checkInDate,
      checkOutDate,
      totalPrice: room.pricePerNight * (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Error creating booking' });
  }
});

module.exports = router;