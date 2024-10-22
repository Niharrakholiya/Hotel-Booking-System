const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  console.log('Entered auth middleware');
  console.log('Cookies:', req.cookies);
  console.log('Headers:', req.headers);

  try {
    let token = req.cookies.jwt_token || req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token from cookies:', req.cookies.jwt_token);
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ status: 'failed', message: 'No authentication token provided' });
    }

    console.log('Token received:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('Decoded token:', decoded);

    const user = await User.findById(decoded.userID);

    if (!user) {
      console.log('No user found for token');
      return res.status(401).json({ status: 'failed', message: 'User not found' });
    }

    console.log('User found:', user);

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    res.status(401).json({ status: 'failed', message: 'Please authenticate', details: error.message });
  }
};

module.exports = auth;