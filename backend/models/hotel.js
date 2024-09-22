// models/hotel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hotelSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to user
  name: { type: String, required: true },
  description: String,
  address: String,
  starRating: Number,
  price: Number,
  amenities: [String],
  photos: [String] // Array to store photo URLs
});

module.exports = mongoose.model('Hotel', hotelSchema);