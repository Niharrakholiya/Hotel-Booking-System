// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { userRegistration, userLogin, changeUserPassword } = require('../controllers/userController');
const checkUserAuth = require('../middleware/auth-middleware');

// Protect change password route
router.use('/changepassword', checkUserAuth);

router.post('/register', userRegistration);
router.post('/login', userLogin);
router.post('/changepassword', changeUserPassword);

module.exports = router;