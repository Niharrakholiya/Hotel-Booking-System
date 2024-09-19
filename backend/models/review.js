const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  re_id: {
    type: String,
    required: true,
    unique: true
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
  star: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
