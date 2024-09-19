const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  qr_id: {
    type: String,
    required: true,
    unique: true
  },
  b_id: {
    type: String,
    required: true,
    ref: 'Booking'  // Reference to Booking model
  },
  c_id: {
    type: String,
    required: true,
    ref: 'Customer'  // Reference to Customer model
  },
  h_id: {
    type: String,
    required: true,
    ref: 'Hotel'  // Reference to Hotel model
  },
  r_id: {
    type: String,
    required: true,
    ref: 'Review'  // Reference to Review model
  },
  check_in: {
    type: Date,
    required: true
  },
  check_out: {
    type: Date,
    required: true
  },
  total_price: {
    type: Number,
    required: true
  },
  generated_at: {
    type: Date,
    default: Date.now
  },
  qr_code_image: {
    type: String, // Assuming it's a URL or base64 encoded image string
    required: true
  }
});

const QRCode = mongoose.model('QRCode', qrCodeSchema);

module.exports = QRCode;
