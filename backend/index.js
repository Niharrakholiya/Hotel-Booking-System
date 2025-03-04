const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const hotelRoutes = require('./routes/hotelroutes');
const roomRoutes = require('./routes/roomroutes');
const customerRoutes = require('./routes/customerroutes');
const guideRoutes = require('./routes/guideroutes');
const bookingRoutes = require('./routes/bookingroutes');
const QRCodeRoutes = require('./routes/qr_coderoutes');
const olaMapRoutes = require('./routes/olamaproutes');
const userRoutes = require('./routes/useroutes');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const path = require('path'); // Import path for handling file paths
const paymentRoutes = require('./routes/paymentroutes');
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); // Parse cookies
app.use((req, res, next) => {
  console.log('Request received:', req.method, req.originalUrl);
  next();
});

// Enable CORS for frontend and allow credentials (cookies)
app.use(cors({
  origin: [
    'https://hotel-booking-system-p50a.onrender.com',
    'https://hotel-booking-system-p50a.onrender.com/',
    'https://localhost:5173',
    'http://localhost:5173/',
  ],
  credentials: true
}));

// API Routes
app.use('/api/hotels', hotelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/guides', guideRoutes); // Use the correct guides route
app.use('/api/booking', bookingRoutes);
app.use('/api/qr_code', QRCodeRoutes);
app.use('/api/ola-maps', olaMapRoutes);
app.use('/api/user', userRoutes); // Corrected the user routes
app.use('/api/payment', paymentRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log('MongoDB URI:', process.env.MONGO_URI); // Log the MongoDB URI

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Simple route for testing the server
app.get('/', (req, res) => {
  res.send('Hotel Booking System API is running');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
