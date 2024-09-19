const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  c_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone_no: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  history: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }]
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
