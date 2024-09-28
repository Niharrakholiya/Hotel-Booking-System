const express = require('express');
const router = express.Router();
const Hotel = require('../models/hotel');
const auth = require('../middleware/auth-middleware');
const multer = require('multer'); // Import multer
const path = require('path'); // Import path for handling file paths

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory to store images locally
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate a unique file name
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
}).fields([
  { name: 'photos', maxCount: 5 }, // Allow up to 5 photos
  { name: 'amenities', maxCount: 1 } // Allow amenities as a field
]);
router.get('/me', auth, async (req, res) => {
  console.log("Entered /me route");
  console.log("User from auth middleware:", req.user);
  try {
    const hotel = await Hotel.findOne({ user: req.user._id });
    if (!hotel) {
      console.log('Hotel not found for user:', req.user._id);
      return res.status(404).json({ error: 'Hotel not found for this user' });
    }
    console.log('Hotel found:', hotel);
    res.json(hotel);
  } catch (error) {
    console.error('Error in /me route:', error);
    res.status(500).json({ error: 'Error fetching hotel' });
  }
});

// Get specific hotel by ID
router.get('/:id', async (req, res) => {
  console.log("I am here");

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

// Create new hotel with photo upload
// Update the create route to use the new upload middleware
router.post('/create', auth, (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message });
    } else if (err) {
      console.error('Unknown error:', err);
      return res.status(500).json({ error: 'An unknown error occurred' });
    }

    try {
      // Check if photos were uploaded
      if (!req.files || !req.files.photos || req.files.photos.length === 0) {
        return res.status(400).json({ error: 'At least one photo is required' });
      }

      const newHotel = new Hotel({
        ...req.body,
        photos: req.files.photos.map(file => file.path),
        user: req.user._id // Assuming you want to associate the hotel with the authenticated user
      });

      if (req.body.amenities) {
        try {
          newHotel.amenities = JSON.parse(req.body.amenities);
        } catch (e) {
          console.error('Error parsing amenities:', e);
          return res.status(400).json({ error: 'Invalid amenities format' });
        }
      }

      const savedHotel = await newHotel.save();
      res.status(201).json(savedHotel);
    } catch (error) {
      console.error('Error creating hotel:', error);
      res.status(400).json({ error: 'Error creating hotel', details: error.message });
    }
  });
});

// Update hotel with new photo upload
router.put('/update', auth, (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message });
    } else if (err) {
      console.error('Unknown error:', err);
      return res.status(500).json({ error: 'An unknown error occurred' });
    }

    try {
      const { starRating, price } = req.body;
      let amenities = [];

      if (req.body.amenities) {
        try {
          amenities = JSON.parse(req.body.amenities);
        } catch (e) {
          console.error('Error parsing amenities:', e);
          return res.status(400).json({ error: 'Invalid amenities format' });
        }
      }

      let hotel = await Hotel.findOne({ user: req.user.id });
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      const updateData = {
        starRating,
        price,
        amenities
      };

      // Handle photo updates
      if (req.files && req.files.photos) {
        updateData.photos = req.files.photos.map(file => file.path);
      }

      hotel = await Hotel.findOneAndUpdate(
        { user: req.user.id },
        { $set: updateData },
        { new: true }
      );

      res.json(hotel);
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Server error', details: error.message });
    }
  });
});
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching hotels' });
  }
});
router.use('*', (req, res) => {
  console.log('Catch-all route hit:', req.method, req.originalUrl);
  res.status(404).json({ message: 'Route not found' });
});
module.exports = router;
