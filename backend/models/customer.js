// models/customer.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to user
  name: { type: String, required: true },
  phone_no: { type: String, required: true },
  address: { type: String, required: true },
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }]
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
