const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hotelSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  description: String,
  address: String,
  starRating: Number,
  price: Number,
  amenities: [String],
  photos: [String],
  profileCompleted: { type: Boolean, default: false },
  location: {
    type: {
      type: String, // 'Point' for GeoJSON
      enum: ['Point'], // <-- this defines the types you allow
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
});

module.exports = mongoose.model('Hotel', hotelSchema);