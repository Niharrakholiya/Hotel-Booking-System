// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const bookingSchema = new Schema({
//   //user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
//   checkInDate: { type: Date, required: true },
//   checkOutDate: { type: Date, required: true },
//   totalPrice: Number,
//   status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' }
// }, { timestamps: true });

// module.exports = mongoose.model('Booking', bookingSchema);


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guestDetailsSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  age: { type: Number, required: true },
  taxiService: { type: Boolean, default: false },
  guideService: { type: Boolean, default: false }
});

const bookingSchema = new Schema({
  customer: { 
    type: Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true 
  },
  hotel: { 
    type: Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  },
  room: { 
    type: Schema.Types.ObjectId, 
    ref: 'Room', 
    required: true 
  },
  checkIn: { 
    type: Date, 
    required: true 
  },
  checkOut: { 
    type: Date, 
    required: true 
  },
  numberOfRooms: { 
    type: Number, 
    required: true,
    min: 1
  },
  numberOfGuests: { 
    type: Number, 
    required: true,
    min: 1
  },
  guestDetails: [guestDetailsSchema],
  pricePerNight: { 
    type: Number, 
    required: true 
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  additionalServices: {
    taxiServiceCount: { type: Number, default: 0 },
    guideServiceCount: { type: Number, default: 0 },
    totalServicesCost: { type: Number, default: 0 }
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },razorpayOrderId: { type: String, }, 
  razorpayPaymentId: { type: String, },
  bookingStatus: { 
    type: String, 
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

// Pre-save middleware to calculate total services cost
bookingSchema.pre('save', function(next) {
  const TAXI_SERVICE_COST = 2000;
  const GUIDE_SERVICE_COST = 2000;
  
  this.additionalServices.taxiServiceCount = this.guestDetails.filter(g => g.taxiService).length;
  this.additionalServices.guideServiceCount = this.guestDetails.filter(g => g.guideService).length;
  
  this.additionalServices.totalServicesCost = 
    (this.additionalServices.taxiServiceCount * TAXI_SERVICE_COST) +
    (this.additionalServices.guideServiceCount * GUIDE_SERVICE_COST);
    
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);