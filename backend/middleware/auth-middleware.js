// middleware/auth-middleware.js
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const checkUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      token = authorization.split(' ')[1];
      const { userID, role } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await UserModel.findById(userID).select('-password');
      req.user.role = role; // Attach role to req.user
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).send({ status: 'failed', message: 'Unauthorized User' });
    }
  }
  
  if (!token) {
    return res.status(401).send({ status: 'failed', message: 'Unauthorized User, No Token' });
  }
};

module.exports = checkUserAuth;
