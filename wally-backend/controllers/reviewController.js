const { reviewService } = require('../services');
const logger = require('../utils/logger');

/**
 * Review Controller - Handles review summarization and fake review detection endpoints
 */

/**
 * Generate AI summary of product reviews
 */
exports.summarizeReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { limit = 50 } = req.query;

        const summary = await reviewService.summarizeReviews(productId, parseInt(limit));
        
        res.status(200).json({
            success: true,
            data: summary
        });
    } catch (error) {
        logger.error('Error summarizing reviews:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error summarizing reviews', 
            error: error.message 
        });
    }
};

/**
 * Calculate trust score and detect fake reviews
 */
exports.calculateTrustScore = async (req, res) => {
    try {
        const { productId } = req.params;

        const trustAnalysis = await reviewService.calculateTrustScore(productId);
        
        res.status(200).json({
            success: true,
            data: trustAnalysis
        });
    } catch (error) {
        logger.error('Error calculating trust score:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error calculating trust score', 
            error: error.message 
        });
    }
};

/**
 * Get reviews with trust scores
 */
exports.getReviewsWithTrust = async (req, res) => {
    try {
        const { productId } = req.params;
        const { 
            limit = 20, 
            sort = '-createdAt', 
            minTrustScore = 0 
        } = req.query;

        const options = {
            limit: parseInt(limit),
            sort,
            minTrustScore: parseInt(minTrustScore)
        };

        const reviews = await reviewService.getReviewsWithTrustScores(productId, options);
        
        res.status(200).json({
            success: true,
            data: reviews,
            count: reviews.length
        });
    } catch (error) {
        logger.error('Error getting reviews with trust scores:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error retrieving reviews', 
            error: error.message 
        });
    }
};

/**
 * Get detailed analysis for a specific review
 */
exports.getReviewAnalysis = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const analysis = await reviewService.getReviewAnalysis(reviewId);
        
        res.status(200).json({
            success: true,
            data: analysis
        });
    } catch (error) {
        logger.error('Error getting review analysis:', error);
        if (error.message === 'Review not found') {
            return res.status(404).json({ 
                success: false,
                message: 'Review not found' 
            });
        }
        res.status(500).json({ 
            success: false,
            message: 'Error analyzing review', 
            error: error.message 
        });
    }
};

// Legacy method for backward compatibility
exports.detectFakeReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const trustAnalysis = await reviewService.calculateTrustScore(productId);
        
        res.status(200).json({
            success: true,
            data: {
                fakeReviews: trustAnalysis.flaggedReviews,
                trustScore: trustAnalysis.overallTrustScore
            }
        });
    } catch (error) {
        logger.error('Error detecting fake reviews:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error detecting fake reviews', 
            error: error.message 
        });
    }
};