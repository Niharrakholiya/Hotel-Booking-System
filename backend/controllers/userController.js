const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer'); // Adjust the path as necessary
const Hotel = require('../models/hotel');

// User Registration Function
const userRegistration = async (req, res) => {
  console.log('Received data:', req.body); // Log the received data
  const { name, email, password, password_confirmation, tc, role } = req.body;
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

        // Create role-specific model instance
        if (role === 'customer') {
          console.log(req.body)
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
        } else if (role === 'hotel') {
          const hotel = new Hotel({ 
            user: newUser._id,
            name: name,
            description: req.body.description || '',
            address: req.body.address || '',
            starRating: req.body.starRating || 0,
            price: req.body.price || 0,
            amenities: req.body.amenities || [],
            photos: req.body.photos || []
          });
          await hotel.save();
        }

        const token = jwt.sign({ userID: newUser._id, role: newUser.role }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' });
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
// User Login Function
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await UserModel.findOne({ email: email });
      if (user != null) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (user.email === email && isMatch) {
          // Generate JWT Token
          const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' });
          res.send({ status: 'success', message: 'Login Success', token: token });
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

// Export the functions
module.exports = {
  userRegistration,
  userLogin,
  changeUserPassword
};
