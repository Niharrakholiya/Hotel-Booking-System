const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');

// Create a customer
router.post('/create', async (req, res) => {
  const { c_id, name, password, email, phone_no, address } = req.body;
  try {
    const customer = new Customer({ c_id, name, password, email, phone_no, address });
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a customer by ID
router.get('/:c_id', async (req, res) => {
  try {
    const customer = await Customer.findOne({ c_id: req.params.c_id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
