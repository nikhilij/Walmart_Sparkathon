const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { validateProductSearch, validateProductRecommendation, validateProductComparison } = require('../middleware/validate');

/**
 * Product Routes - Handles product search, recommendations, and comparison endpoints
 */

// Route for getting all products with optional filtering
router.get('/', productController.getAllProducts);

// Route for searching products
router.get('/search', validateProductSearch, productController.searchProducts);

// Route for getting personalized product recommendations
router.post('/recommend', optionalAuth, validateProductRecommendation, productController.recommendProducts);

// Route for comparing multiple products
router.post('/compare', optionalAuth, validateProductComparison, productController.compareProducts);

// Route for retrieving a specific product by ID with Wally Score
router.get('/:id', optionalAuth, productController.getProductById);

module.exports = router;