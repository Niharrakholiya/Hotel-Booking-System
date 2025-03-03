const express = require('express');
const router = express.Router();
const Hotel = require('../models/hotel');
const auth = require('../middleware/auth-middleware');
const multer = require('multer'); // Import multer
const path = require('path'); // Import path for handling file paths
const checkProfileCompletion = require('../middleware/ProfileCheck');
const { completeHotelProfile } = require('../controllers/userController');
const Room = require('../models/room');
const {authorizedRole }= require('../controllers/userController');
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
});
  



// Update hotel route
router.put('/:id', auth, upload.array('photos', 5), async (req, res) => {
  console.log("Entered /:id route");
  try {
    // First check if the hotel exists and belongs to the authenticated user
    const hotel = await Hotel.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found or unauthorized' });
    }
    console.log("req.body:", req.body);
    console.log("req.body.name:", req.body.name);
    // Prepare update data
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      address: req.body.address,
      starRating: Number(req.body.starRating) || hotel.starRating,
      price: Number(req.body.price) || hotel.price,
      profileCompleted: req.body.profileCompleted === 'true' || req.body.profileCompleted === true
    };
    console.log("Update data:", updateData);

    // Handle amenities
    if (req.body.amenities) {
      try {
        // Check if amenities is a string that needs to be parsed
        updateData.amenities = typeof req.body.amenities === 'string' 
          ? JSON.parse(req.body.amenities)
          : req.body.amenities;
      } catch (e) {
        console.error('Error parsing amenities:', e);
        return res.status(400).json({ error: 'Invalid amenities format' });
      }
    }

    // Handle new photos if they were uploaded
    if (req.files && req.files.length > 0) {
      updateData.photos = req.files.map(file => file.path);
    }

    // Update the hotel with new data
    const updatedHotel = await Hotel.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    // Format the response to match the frontend expectations
    const formattedResponse = {
      ...updatedHotel.toObject(),
      amenities: updatedHotel.amenities || [],
      photos: updatedHotel.photos || []
    };

    res.json(formattedResponse);
  } catch (error) {
    console.error('Error updating hotel:', error);
    res.status(500).json({ 
      error: 'Error updating hotel', 
      details: error.message 
    });
  }
});

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

router.get('/search', async (req, res) => {
  try {
    const { searchTerm } = req.query;

    let query = {};

    if (searchTerm) {
      // Search in both name and description fields
      query = {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ]
      };
    }

    const hotels = await Hotel.find(query);

    res.json({
      success: true,
      count: hotels.length,
      data: hotels
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching hotels',
      error: error.message
});
}
});
router.post('/complete-profile', auth, upload.array('photos', 5), checkProfileCompletion, completeHotelProfile);


router.post('/complete-setup', auth, async (req, res) => {
  try {
    const { location } = req.body;
    
    if (!location) {
      return res.status(400).json({ error: 'Location data is required' });
    }

    let parsedLocation;
    try {
      parsedLocation = JSON.parse(location);
    } catch (parseError) {
      console.error('Error parsing location data:', parseError);
      return res.status(400).json({ error: 'Invalid location data format' });
    }

    if (!parsedLocation.lat || !parsedLocation.lng) {
      return res.status(400).json({ error: 'Location data must include lat and lng' });
    }

    // Find the hotel associated with the authenticated user
    let hotel = await Hotel.findOne({ user: req.user._id });
    
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    
    // Update the hotel with the location data
    hotel.location = {
      type: "Point",
      coordinates: [parsedLocation.lng, parsedLocation.lat]
    };
    
    // Set profileCompleted to true
    hotel.profileCompleted = true;
    
    // Save the updated hotel
    await hotel.save();
    
    res.status(200).json({ message: 'Hotel setup completed successfully', hotel });
  } catch (error) {
    console.error('Error completing hotel setup:', error);
    res.status(500).json({ error: 'Error completing hotel setup', details: error.message });
  }
});

router.post('/rooms', auth, upload.array('photos', 5), async (req, res) => {
  try {
      const hotel = await Hotel.findOne({ user: req.user._id });
      if (!hotel) {
          return res.status(404).json({ error: 'Hotel not found' });
      }
      const pricePerNight = Number(req.body.pricePerNight);
      const capacity = Number(req.body.capacity);
      
      if (isNaN(pricePerNight) || isNaN(capacity)) {
          return res.status(400).json({ 
              error: 'Invalid input',
              details: 'Price per night and capacity must be valid numbers'
          });
      }
      let amenities = req.body.amenities;
      if (typeof amenities === 'string') {
          try {
              amenities = JSON.parse(amenities);
          } catch (e) {
              return res.status(400).json({
                  error: 'Invalid input',
                  details: 'Amenities must be a valid array'
              });
          }
      }
      const newRoom = new Room({
          hotel: hotel._id,
          roomType: req.body.roomType,
          pricePerNight: pricePerNight,
          capacity: capacity,
          amenities: req.body.amenities,
          photos: req.files.map(file => file.path),
          description: req.body.description,
          roomAvailability: true
      });

      const savedRoom = await newRoom.save();
      res.status(201).json(savedRoom);
  } catch (error) {
      console.error('Error adding room:', error);
      res.status(500).json({ error: 'Error adding room', details: error.message });
  }
});


// Get rooms for a specific hotel
router.get('/rooms', auth, async (req, res) => {
  try {
    console.log('Authenticated user:', req.user);

    // Check if Room model is defined
    if (!Room) {
      console.error('Room model is not defined!');
      return res.status(500).json({ error: 'Room model not initialized' });
    }

    const hotel = await Hotel.findOne({ user: req.user._id });
    console.log('Found hotel:', hotel);

    if (!hotel) {
      console.log('No hotel found for user:', req.user._id);
      return res.status(404).json({ error: 'Hotel not found' });
    }

    console.log('Searching for rooms with hotel ID:', hotel._id);
    const rooms = await Room.find({ hotel: hotel._id });
    console.log('Found rooms:', rooms);

    const transformedRooms = rooms.map(room => ({
      _id: room._id,
      category: room.roomType,
      price: room.pricePerNight,
      availability: room.capacity,
      amenities: room.amenities,
      photos: room.photos,
      description: room.description,
      roomAvailability: room.roomAvailability
    }));

    console.log('Sending transformed rooms:', transformedRooms);
    res.json(transformedRooms);
  } catch (error) {
    console.error('Detailed error in /rooms route:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      error: 'Error fetching rooms',
      details: error.message 
    });
  }
});
router.put('/rooms/:id', auth, upload.array('photos', 5), async (req, res) => {
  try {
    console.log('Request body:', req.body);

    const hotel = await Hotel.findOne({ user: req.user._id });
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    // Parse existing photos and amenities
    const existingPhotos = req.body.existingPhotos ? JSON.parse(req.body.existingPhotos) : [];
    const amenities = req.body.amenities ? JSON.parse(req.body.amenities) : [];
    
    // Combine existing photos with new uploaded photos
    const photos = [
      ...existingPhotos,
      ...(req.files ? req.files.map(file => file.path) : [])
    ];

    const room = await Room.findOneAndUpdate(
      {
        _id: req.params.id,
        hotel: hotel._id
      },
      {
        roomType: req.body.roomType,
        pricePerNight: req.body.pricePerNight,
        capacity: req.body.capacity,
        roomAvailability: req.body.roomAvailability,
        amenities: amenities,
        photos: photos,
        description: req.body.description
      },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    console.log('Updated room:', room);

    res.json(room);
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ error: 'Error updating room' });
  }
});

router.get('/:id/rooms', auth,async (req, res) => {
  try {
      const { id } = req.params; // Correct this to 'id' instead of 'hotelId'
      
      if (!id) {
          return res.status(400).json({ 
              success: false, 
              message: 'Hotel ID is required' 
          });
      }

      const rooms = await Room.find({ hotel: id }) // Use 'id' here as well
          .sort({ createdAt: -1 }); // Sort by newest first

      res.status(200).json({
          success: true,
          count: rooms.length,
          data: rooms
      });
  } catch (error) {
      console.error('Error fetching rooms:', error);
      res.status(500).json({
          success: false,
          message: 'Error fetching rooms',
          error: error.message
      });
  }
});

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



// Add this route to your hotel routes file (after the other room routes)

// Delete room route
router.delete('/rooms/:id', auth, async (req, res) => {
  try {
    // First find the hotel associated with the authenticated user
    const hotel = await Hotel.findOne({ user: req.user._id });
    if (!hotel) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hotel not found' 
      });
    }

    // Find and delete the room, ensuring it belongs to the user's hotel
    const room = await Room.findOneAndDelete({
      _id: req.params.id,
      hotel: hotel._id
    });

    if (!room) {
      return res.status(404).json({ 
        success: false, 
        message: 'Room not found or unauthorized to delete' 
      });
    }

    // If the room had photos, you might want to delete them from the filesystem
    if (room.photos && room.photos.length > 0) {
      const fs = require('fs').promises;
      for (const photo of room.photos) {
        try {
          await fs.unlink(photo);
        } catch (err) {
          console.error(`Failed to delete photo ${photo}:`, err);
          // Continue with the deletion even if photo removal fails
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting room',
      error: error.message
    });
  }
});
router.use('*', (req, res) => {
  console.log('Catch-all route hit:', req.method, req.originalUrl);
  res.status(404).json({ message: 'Route not found' });
});
module.exports = router;
