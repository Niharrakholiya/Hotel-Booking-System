const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true }, // Reference to the hotel
  roomType: { type: String, required: true },  // e.g., Deluxe, Standard, etc.
  pricePerNight: { type: Number, required: true },  // Room price per night
  capacity: Number,  // Number of people the room can accommodate
  amenities: [String],  // Room-specific amenities
  photos: [String],  // Array to store room photo URLs
  roomAvailability: { type: Boolean, default: true }  // Whether the room is available for booking
});

module.exports = mongoose.model('Room', roomSchema);
