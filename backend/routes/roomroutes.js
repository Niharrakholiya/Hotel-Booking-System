const express = require('express');
const router = express.Router();
const Hotel = require('../models/hotel');
const Room = require('../models/room');
const mongoose = require('mongoose'); // Import mongoose to use ObjectId validation

// Get all hotels
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching hotels' });
  }
});

// Get a specific hotel by ID
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching hotel' });
  }
});

// Create a new hotel
router.post('/create', async (req, res) => {
  try {
    // Destructure the data from the request body
    const { hotel, roomType, pricePerNight, capacity, amenities, photos, roomAvailability } = req.body;

    // Log the hotel ID for debugging
    console.log('Received hotel:', hotel);

    // Check if the hotel ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(hotel)) {
      return res.status(400).json({ error: 'Invalid hotel ID format' });
    }

    // Check if the hotel exists
    const existingHotel = await Hotel.findById(hotel);
    if (!existingHotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    // Create a new room associated with the existing hotel
    const newRoom = new Room({
      hotel: existingHotel._id,  // Refer to the existing hotel's ObjectId
      roomType,
      pricePerNight,
      capacity,
      amenities,
      photos,
      roomAvailability
    });

    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    console.error('Error:', error); // Log error for debugging
    res.status(400).json({ error: 'Error creating room' });
  }
});



module.exports = router;
