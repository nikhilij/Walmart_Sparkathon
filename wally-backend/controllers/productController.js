const { productService } = require('../services');
const logger = require('../utils/logger');

/**
 * Product Controller - Handles product search, recommendations, and comparison endpoints
 */

/**
 * Get all products with optional filtering
 */
exports.getAllProducts = async (req, res) => {
    try {
        const { category, limit = 20, sort = '-popularity' } = req.query;
        
        let products;
        if (category) {
            products = await productService.getPopularProducts(category, parseInt(limit));
        } else {
            products = await productService.getPopularProducts(null, parseInt(limit));
        }
        
        res.status(200).json({
            success: true,
            data: products,
            count: products.length
        });
    } catch (error) {
        logger.error('Error retrieving products:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error retrieving products', 
            error: error.message 
        });
    }
};

/**
 * Get product by ID with Wally Score
 */
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId || 'anonymous';
        
        const product = await productService.getProductById(id, userId);
        
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        logger.error('Error retrieving product:', error);
        if (error.message === 'Product not found') {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found' 
            });
        }
        res.status(500).json({ 
            success: false,
            message: 'Error retrieving product', 
            error: error.message 
        });
    }
};

/**
 * Search products based on query parameters
 */
exports.searchProducts = async (req, res) => {
    try {
        const { 
            query, 
            category, 
            minPrice, 
            maxPrice, 
            limit = 20 
        } = req.query;

        const searchParams = {
            query,
            category,
            budget: {}
        };

        if (minPrice) searchParams.budget.min = parseInt(minPrice);
        if (maxPrice) searchParams.budget.max = parseInt(maxPrice);
        if (!minPrice && !maxPrice) searchParams.budget = null;
        
        searchParams.limit = parseInt(limit);

        const products = await productService.searchProducts(searchParams);
        
        res.status(200).json({
            success: true,
            data: products,
            count: products.length,
            searchParams: {
                query,
                category,
                budget: searchParams.budget
            }
        });
    } catch (error) {
        logger.error('Error searching products:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error searching products', 
            error: error.message 
        });
    }
};

/**
 * Get personalized product recommendations
 */
exports.recommendProducts = async (req, res) => {
    try {
        const userId = req.user?.userId || 'anonymous';
        const { 
            category, 
            budget, 
            preferences = [] 
        } = req.body;

        const intent = {
            category: category || 'general',
            budget: budget ? {
                min: budget.min || 0,
                max: budget.max
            } : null,
            preferences: Array.isArray(preferences) ? preferences : [preferences]
        };

        const recommendations = await productService.getRecommendations(intent, userId);
        
        res.status(200).json({
            success: true,
            data: recommendations,
            count: recommendations.length,
            intent
        });
    } catch (error) {
        logger.error('Error generating recommendations:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error generating recommendations', 
            error: error.message 
        });
    }
};

/**
 * Compare multiple products
 */
exports.compareProducts = async (req, res) => {
    try {
        const { productIds } = req.body;
        const userId = req.user?.userId || 'anonymous';

        if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'At least 2 product IDs are required for comparison'
            });
        }

        if (productIds.length > 5) {
            return res.status(400).json({
                success: false,
                message: 'Cannot compare more than 5 products at once'
            });
        }

        const comparison = await productService.compareProducts(productIds, userId);
        
        res.status(200).json({
            success: true,
            data: comparison
        });
    } catch (error) {
        logger.error('Error comparing products:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error comparing products', 
            error: error.message 
        });
    }
};