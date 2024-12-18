const express = require('express');
const { createReview, getReviewsByCustomer, getReviews, respondToReview, getResponseStats,} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { submitReview } = require('../services/reviewService');
const router = express.Router();

// router.post('/:customerId/review', protect, createReview);
router.post('/reviews', protect, createReview);

router.post('/new', submitReview);

// Route to get reviews by customerId
router.get('/:customerId', protect, getReviewsByCustomer);

// Get paginated, sorted, and filtered reviews
// router.get('/:clientId', protect, getReviews);

// Route to get response stats for a specific client
router.get('/stats/:clientId', protect, getResponseStats);

// Respond to a review
router.post('/respond/:reviewId', protect, respondToReview);

module.exports = router;

