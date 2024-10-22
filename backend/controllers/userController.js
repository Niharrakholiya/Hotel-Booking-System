const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer'); // Adjust the path as necessary
const Hotel = require('../models/hotel');

// User Registration Function
const userRegistration = async (req, res) => {
  console.log('Received data:', req.body); // Log the received data
  const { name, email, password, password_confirmation, tc, role, location } = req.body; // Include location in destructuring
  const user = await UserModel.findOne({ email: email });

  if (user) {
    return res.send({ status: 'failed', message: 'Email already exists' });
  }

  if (name && email && password && password_confirmation && tc && role) {
    if (password === password_confirmation) {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new UserModel({
          name,
          email,
          password: hashPassword,
          tc,
          role
        });
        await newUser.save();

        const token = jwt.sign({ userID: newUser._id, role: newUser.role }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' });

        // Create role-specific model instance
        if (role === 'customer') {
          const { phone_no, address } = req.body;
          if (!phone_no || !address) {
            return res.send({ status: 'failed', message: 'Phone number and address are required for customers' });
          }
          const customer = new Customer({
            user: newUser._id,
            name,
            phone_no,
            address,
            history: []
          });
          await customer.save();
          return res.status(201).send({ status: 'success', message: 'Registration Success', token });
        } else if (role === 'hotel') {
          // Ensure location is provided and structured correctly
         

          const hotel = new Hotel({
            user: newUser._id,
            name: name || '', // Required name
            description: req.body.description || '', // Allow empty fields for profile completion
            address: req.body.address || '',
            starRating: req.body.starRating || 0,
            price: req.body.price || 0,
            amenities: req.body.amenities || [],
            photos: req.body.photos || [],
            location: {
              type: "Point", // Default to GeoJSON type
              coordinates: location && location.longitude && location.latitude 
                ? [location.longitude, location.latitude] // Use provided coordinates if available
                : [0, 0] // Default to (0, 0) if location is not provided
            },
            profileCompleted: false // New field to track profile completion
          });
          await hotel.save();
          return res.status(201).send({ 
            status: 'success', 
            message: 'Registration Success', 
            token,
            profileCompleted: false
          });
        }

        // For any other roles
        return res.status(201).send({ status: 'success', message: 'Registration Success', token });

      } catch (error) {
        console.log(error);
        return res.send({ status: 'failed', message: 'Unable to Register', error: error.message });
      }
    } else {
      return res.send({ status: 'failed', message: "Password and Confirm Password don't match" });
    }
  } else {
    return res.send({ status: 'failed', message: 'All fields are required' });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await UserModel.findOne({ email: email });
      if (user != null) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (user.email === email && isMatch) {
          // Generate JWT Token
          const token = jwt.sign({ userID: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' });
          console.log('User:', user);
          console.log('Token:', token);
          const hotel = await Hotel.findOne({ user: user._id });
          
          // Check if hotel profile is incomplete
          if (user.role === 'hotel' && hotel && !hotel.profileCompleted) {
            // Send a response to indicate profile completion is required
            return res.send({ 
              status: 'incomplete', 
              message: 'Profile completion required', 
              token: token 
            });
          }

          res.send({ status: 'success', message: 'Login Success', token });
        } else {
          res.send({ status: 'failed', message: 'Email or Password is not Valid' });
        }
      } else {
        res.send({ status: 'failed', message: 'You are not a Registered User' });
      }
    } else {
      res.send({ status: 'failed', message: 'All Fields are Required' });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: 'failed', message: 'Unable to Login' });
  }
};

const changeUserPassword = async (req, res) => {
  const { password, password_confirmation } = req.body;
  if (password && password_confirmation) {
    if (password !== password_confirmation) {
      res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" });
    } else {
      try {
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);
        await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } });
        res.send({ "status": "success", "message": "Password changed successfully" });
      } catch (error) {
        console.log(error);
        res.send({ "status": "failed", "message": "Unable to change password" });
      }
    }
  } else {
    res.send({ "status": "failed", "message": "All Fields are Required" });
  }
};
// controllers/userController.js

const completeHotelProfile = async (req, res) => {
  try {
    const { description, address, starRating, price, amenities, location } = req.body; // Include location in destructuring
    const hotel = req.hotel; // Get the hotel from the previous middleware

    // Update hotel information
    hotel.description = description || hotel.description;
    hotel.address = address || hotel.address;
    hotel.starRating = starRating || hotel.starRating;
    hotel.price = price || hotel.price;
    hotel.amenities = amenities ? JSON.parse(amenities) : hotel.amenities;

    // Handle location data
    if (location) {
      const parsedLocation = JSON.parse(location);
      // Ensure location has the required structure
      if (parsedLocation.type && parsedLocation.coordinates) {
        hotel.location = parsedLocation; // Assign parsed location data
      } else {
        return res.status(400).send({ status: 'failed', message: 'Invalid location data' });
      }
    }

    // Handle photo uploads
    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map(file => file.path);
      hotel.photos = [...hotel.photos, ...newPhotos];
    }

    hotel.profileCompleted = true; // Mark profile as completed

    await hotel.save();

    res.status(200).send({ status: 'success', message: 'Profile updated successfully', hotel });
  } catch (error) {
    console.error('Error in completeHotelProfile:', error);
    res.status(500).send({ status: 'failed', message: 'Unable to complete profile', error: error.message });
  }
};

const authorizedRole=(roles)=>{
  return (req,res,next)=>{
    if(roles.includes(req.user.role)){
      next();
    }else{
      res.status(403).send({error:'You are not authorized to access this route'})
    }
  }
}
// Export the functions
module.exports = {
  userRegistration,
  userLogin,
  changeUserPassword,
  completeHotelProfile,
  authorizedRole
};
