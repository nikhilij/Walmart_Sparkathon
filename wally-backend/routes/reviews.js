const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');
const { validateReview } = require('../middleware/validate');

/**
 * Review Routes - Handles review summarization, trust score, and review CRUD
 */

// Summarize reviews for a product
router.get('/summarize/:productId', reviewController.summarizeReviews);

// Calculate trust score and detect fake reviews for a product
router.get('/trust/:productId', reviewController.calculateTrustScore);

// Get reviews for a product with trust scores
router.get('/with-trust/:productId', reviewController.getReviewsWithTrust);

// Get detailed analysis for a specific review
router.get('/analysis/:reviewId', reviewController.getReviewAnalysis);

// Legacy: Detect fake reviews (alias for trust)
router.get('/detect-fake/:productId', reviewController.detectFakeReviews);

// Route to create a new review
router.post('/', authenticate, validateReview, reviewController.createReview);

// Route to get all reviews
router.get('/', reviewController.getAllReviews);

// Route to get a specific review by ID
router.get('/:id', reviewController.getReviewById);

// Route to update a review by ID
router.put('/:id', authenticate, validateReview, reviewController.updateReview);

// Route to delete a review by ID
router.delete('/:id', authenticate, reviewController.deleteReview);

module.exports = router;