// models/user.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'hotel'], required: true }, // Add role field
  tc: { type: Boolean, required: true }
});

module.exports = mongoose.model('User', userSchema);