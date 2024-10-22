// middleware/profileCheck.js
const Hotel = require('../models/hotel');

const checkProfileCompletion = async (req, res, next) => {
  try {
    const hotel = await Hotel.findOne({ user: req.user._id });
    
    if (!hotel) {
      return res.status(404).send({ status: 'failed', message: 'Hotel not found' });
    }

    // Allow updates even if the profile is already completed
    req.hotel = hotel; // Pass the hotel to the next middleware/controller
    next();
  } catch (error) {
    console.error('Error in checkProfileCompletion:', error);
    res.status(500).send({ status: 'failed', message: 'Server error', error: error.message });
  }
};

module.exports = checkProfileCompletion;