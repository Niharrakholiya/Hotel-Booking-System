const express = require('express');
const router = express.Router();
const QRCode = require('../models/qr_code');
const Booking = require('../models/booking'); // Import Booking model for validation
const Customer = require('../models/customer'); // Import Customer model for validation
const Hotel = require('../models/hotel');     // Import Hotel model for validation
const Review = require('../models/review');   // Import Review model for validation

// Create a new QR Code
router.post('/', async (req, res) => {
    try {
        const { qr_id, b_id, c_id, h_id, r_id, check_in, check_out, total_price, qr_code_image } = req.body;

        // Validate references
        const booking = await Booking.findOne({ b_id });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        const customer = await Customer.findOne({ c_id });
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        const hotel = await Hotel.findOne({ h_id });
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

        const review = await Review.findOne({ r_id });
        if (!review) return res.status(404).json({ message: 'Review not found' });

        // Create and save the QR Code
        const qrCode = new QRCode({ qr_id, b_id, c_id, h_id, r_id, check_in, check_out, total_price, qr_code_image });
        const savedQRCode = await qrCode.save();
        res.status(201).json(savedQRCode);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all QR Codes
router.get('/', async (req, res) => {
    try {
        const qrCodes = await QRCode.find()
            .populate('b_id')
            .populate('c_id')
            .populate('h_id')
            .populate('r_id');
        res.status(200).json(qrCodes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a QR Code by ID
router.get('/:qr_id', async (req, res) => {
    try {
        const { qr_id } = req.params;
        const qrCode = await QRCode.findOne({ qr_id })
            .populate('b_id')
            .populate('c_id')
            .populate('h_id')
            .populate('r_id');
        if (!qrCode) return res.status(404).json({ message: 'QR Code not found' });
        res.status(200).json(qrCode);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a QR Code
router.put('/:qr_id', async (req, res) => {
    try {
        const { qr_id } = req.params;
        const { b_id, c_id, h_id, r_id, check_in, check_out, total_price, qr_code_image } = req.body;

        // Validate references
        const booking = await Booking.findOne({ b_id });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        const customer = await Customer.findOne({ c_id });
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        const hotel = await Hotel.findOne({ h_id });
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

        const review = await Review.findOne({ r_id });
        if (!review) return res.status(404).json({ message: 'Review not found' });

        // Update the QR Code
        const updatedQRCode = await QRCode.findOneAndUpdate(
            { qr_id },
            { b_id, c_id, h_id, r_id, check_in, check_out, total_price, qr_code_image },
            { new: true }
        )
        .populate('b_id')
        .populate('c_id')
        .populate('h_id')
        .populate('r_id');

        if (!updatedQRCode) return res.status(404).json({ message: 'QR Code not found' });
        res.status(200).json(updatedQRCode);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a QR Code
router.delete('/:qr_id', async (req, res) => {
    try {
        const { qr_id } = req.params;
        const deletedQRCode = await QRCode.findOneAndDelete({ qr_id });
        if (!deletedQRCode) return res.status(404).json({ message: 'QR Code not found' });
        res.status(200).json({ message: 'QR Code deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
