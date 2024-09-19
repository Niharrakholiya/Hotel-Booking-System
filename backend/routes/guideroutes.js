const express = require('express');
const router = express.Router();
const Guide = require('../models/guide');
const Hotel = require('../models/hotel'); // Assuming there's a Hotel model

// Create a new guide
router.post('/', async (req, res) => {
    try {
        const { g_id, h_id, check_in, check_out, g_prefrences, price } = req.body;

        // Check if hotel exists
        const hotel = await Hotel.findById(h_id);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        const guide = new Guide({ g_id, h_id, check_in, check_out, g_prefrences, price });
        const savedGuide = await guide.save();
        res.status(201).json(savedGuide);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all guides for a specific hotel
router.get('/hotel/:h_id', async (req, res) => {
    try {
        const guides = await Guide.find({ h_id: req.params.h_id }).populate('h_id');
        res.json(guides);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific guide by ID
router.get('/:id', async (req, res) => {
    try {
        const guide = await Guide.findById(req.params.id).populate('h_id');
        if (!guide) return res.status(404).json({ message: 'Guide not found' });
        res.json(guide);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a guide
router.put('/:id', async (req, res) => {
    try {
        const { h_id, check_in, check_out, g_prefrences, price } = req.body;

        // Check if hotel exists
        const hotel = await Hotel.findById(h_id);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        const guide = await Guide.findByIdAndUpdate(
            req.params.id,
            { h_id, check_in, check_out, g_prefrences, price },
            { new: true }
        );
        if (!guide) return res.status(404).json({ message: 'Guide not found' });
        res.json(guide);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a guide
router.delete('/:id', async (req, res) => {
    try {
        const guide = await Guide.findByIdAndDelete(req.params.id);
        if (!guide) return res.status(404).json({ message: 'Guide not found' });
        res.json({ message: 'Guide deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
