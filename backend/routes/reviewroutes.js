const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const Customer = require('../models/customer'); // Import Customer model for validation
const Hotel = require('../models/hotel');     // Import Hotel model for validation

// Create a new review
router.post('/', async (req, res) => {
    try {
        const { re_id, c_id, h_id, star, description, type } = req.body;

        // Validate customer
        const customer = await Customer.findOne({ c_id });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Validate hotel
        const hotel = await Hotel.findOne({ h_id });
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        // Create and save the review
        const review = new Review({ re_id, c_id, h_id, star, description, type });
        const savedReview = await review.save();
        res.status(201).json(savedReview);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find().populate('c_id').populate('h_id');
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a review by ID
router.get('/:re_id', async (req, res) => {
    try {
        const { re_id } = req.params;
        const review = await Review.findOne({ re_id }).populate('c_id').populate('h_id');
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a review
router.put('/:re_id', async (req, res) => {
    try {
        const { re_id } = req.params;
        const { c_id, h_id, star, description, type } = req.body;

        // Validate customer
        const customer = await Customer.findOne({ c_id });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Validate hotel
        const hotel = await Hotel.findOne({ h_id });
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        // Update the review
        const updatedReview = await Review.findOneAndUpdate(
            { re_id },
            { c_id, h_id, star, description, type },
            { new: true }
        ).populate('c_id').populate('h_id');

        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(updatedReview);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a review
router.delete('/:re_id', async (req, res) => {
    try {
        const { re_id } = req.params;
        const deletedReview = await Review.findOneAndDelete({ re_id });
        if (!deletedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
