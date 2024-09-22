const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const hotelRoutes = require('./routes/hotelroutes');
const roomRoutes = require('./routes/roomroutes');
const customerRoutes = require('./routes/customerroutes');
const guideRouts = require('./routes/guideroutes');
const bookingRoutes = require('./routes/bookingroutes');
const guideRoutes = require('./routes/guideroutes');
const QRCodeRoutes = require('./routes/qr_coderoutes');
const olaMapRoutes = require('./routes/olamaproutes');
const userRoutes = require('./routes/useroutes');
dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Enable CORS for all origins

app.use(cors({
  origin: 'http://localhost:5173' // Allow requests from this origin
}));

app.use('/api/hotels', hotelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/customers', customerRoutes); // Corrected route
app.use('/api/guides', guideRouts);
app.use('/api/booking', bookingRoutes);
app.use('/api/guide', guideRoutes);
app.use('/api/qr_code', QRCodeRoutes);
app.use('/api/ola-maps', olaMapRoutes);
app.use("/api/user", userRoutes)


console.log('MongoDB URI:', process.env.MONGO_URI); // Add this line

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Simple route
app.get('/', (req, res) => {
  res.send('Hotel Booking System API is running');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
