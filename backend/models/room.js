const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  hotel: { 
    type: Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  },
  roomType: { 
    type: String, 
    required: true 
  },
  pricePerNight: { 
    type: Number, 
    required: true 
  },
  capacity: { 
    type: Number,
    required: true,
    min: 0,
    max: 40 // Match frontend MAX_ROOMS_PER_CATEGORY
  },
  amenities: [String],
  photos: [String],
  description: { 
    type: String,
    required: true 
  },
  roomAvailability: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);