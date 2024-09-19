const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  //user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  totalPrice: Number,
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);