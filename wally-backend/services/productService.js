const Product = require('../models/Product');
const User = require('../models/User');
const azureML = require('../utils/azureML');
const logger = require('../utils/logger');
const { PythonShell } = require('python-shell');
const path = require('path');

/**
 * Product Service - Handles product search, recommendations, and Wally Score calculation
 */
class ProductService {
  /**
   * Search products based on query parameters
   * @param {Object} searchParams - Search parameters
   * @returns {Array} - Array of products
   */
  async searchProducts(searchParams) {
    try {
      const { query, category, budget, limit = 10 } = searchParams;
      
      let searchQuery = {};

      // Add text search if query provided
      if (query) {
        searchQuery.$text = { $search: query };
      }

      // Add category filter
      if (category && category !== 'general') {
        searchQuery.category = category;
      }

      // Add budget filter
      if (budget) {
        searchQuery.price = {};
        if (budget.min) searchQuery.price.$gte = budget.min;
        if (budget.max) searchQuery.price.$lte = budget.max;
      }

      const products = await Product.find(searchQuery)
        .limit(limit)
        .sort({ popularity: -1 });

      logger.info(`Found ${products.length} products for search query`);
      return products;
    } catch (error) {
      logger.error('Error searching products:', error);
      throw error;
    }
  }

  /**
   * Get personalized product recommendations
   * @param {Object} intent - User intent with preferences
   * @param {string} userId - User ID for personalization
   * @returns {Array} - Array of recommended products with Wally Scores
   */
  async getRecommendations(intent, userId) {
    try {
      logger.info(`Getting recommendations for user ${userId}`);

      // First, get products based on search criteria
      const searchParams = {
        category: intent.category,
        budget: intent.budget,
        limit: 20 // Get more products for better recommendations
      };

      let products = await this.searchProducts(searchParams);

      if (products.length === 0) {
        // Fallback: get popular products in category
        products = await Product.find({ category: intent.category || 'general' })
          .limit(10)
          .sort({ popularity: -1 });
      }

      // Get user preferences for personalization
      const user = await User.findById(userId);
      const userPreferences = user ? user.preferences : {};

      // Calculate Wally Scores for each product
      const productsWithScores = await Promise.all(
        products.map(async (product) => {
          const wallyScore = await this.calculateWallyScore(product, userPreferences, intent);
          return {
            ...product.toObject(),
            wallyScore
          };
        })
      );

      // Sort by Wally Score and return top 3
      const recommendations = productsWithScores
        .sort((a, b) => b.wallyScore - a.wallyScore)
        .slice(0, 3);

      // Use collaborative filtering if available
      try {
        const mlRecommendations = await this.getMLRecommendations(userId, intent);
        if (mlRecommendations && mlRecommendations.length > 0) {
          // Merge ML recommendations with rule-based recommendations
          logger.info('Using ML-enhanced recommendations');
        }
      } catch (mlError) {
        logger.warn('ML recommendations failed, using rule-based approach:', mlError.message);
      }

      return recommendations;
    } catch (error) {
      logger.error('Error getting recommendations:', error);
      throw error;
    }
  }

  /**
   * Calculate Wally Score for a product
   * @param {Object} product - Product object
   * @param {Object} userPreferences - User preferences
   * @param {Object} intent - User intent
   * @returns {number} - Wally Score (0-100)
   */
  async calculateWallyScore(product, userPreferences, intent) {
    try {
      // Use Python script for Wally Score calculation
      const options = {
        mode: 'json',
        pythonPath: 'python3',
        scriptPath: path.join(__dirname, '../scripts'),
        args: [JSON.stringify({
          product: {
            id: product._id,
            price: product.price,
            rating: product.rating,
            reviewCount: product.reviewCount,
            category: product.category,
            features: product.features || []
          },
          userPreferences,
          intent: {
            budget: intent.budget,
            preferences: intent.preferences || [],
            category: intent.category
          }
        })]
      };

      const results = await new Promise((resolve, reject) => {
        PythonShell.run('wallyScore.py', options, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });

      const wallyScore = results && results[0] ? results[0].score : 50;
      logger.info(`Calculated Wally Score ${wallyScore} for product ${product._id}`);
      
      return Math.round(wallyScore);
    } catch (error) {
      logger.error('Error calculating Wally Score:', error);
      // Fallback to simple scoring algorithm
      return this.calculateSimpleWallyScore(product, userPreferences, intent);
    }
  }

  /**
   * Simple fallback Wally Score calculation
   * @param {Object} product - Product object
   * @param {Object} userPreferences - User preferences
   * @param {Object} intent - User intent
   * @returns {number} - Simple Wally Score (0-100)
   */
  calculateSimpleWallyScore(product, userPreferences, intent) {
    let score = 50; // Base score

    // Budget fit (30% weight)
    if (intent.budget) {
      const budgetFit = this.calculateBudgetFit(product.price, intent.budget);
      score += budgetFit * 0.3;
    }

    // Rating (25% weight)
    if (product.rating) {
      const ratingScore = (product.rating - 3) * 10; // Convert 1-5 to -20 to +20
      score += ratingScore * 0.25;
    }

    // Review count (15% weight) - more reviews = more reliable
    if (product.reviewCount) {
      const reviewScore = Math.min(product.reviewCount / 100, 1) * 20; // Cap at 20 points
      score += reviewScore * 0.15;
    }

    // Category preference (20% weight)
    if (intent.category && product.category === intent.category) {
      score += 20 * 0.2;
    }

    // User preference alignment (10% weight)
    if (userPreferences && userPreferences.favoriteCategories) {
      if (userPreferences.favoriteCategories.includes(product.category)) {
        score += 10 * 0.1;
      }
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Calculate how well product price fits user budget
   * @param {number} price - Product price
   * @param {Object} budget - Budget constraints
   * @returns {number} - Budget fit score (-20 to +20)
   */
  calculateBudgetFit(price, budget) {
    if (!budget) return 0;

    const { min = 0, max } = budget;

    if (price < min) {
      // Too cheap - might be low quality
      return -10;
    }

    if (max && price > max) {
      // Too expensive
      const overage = (price - max) / max;
      return -20 * Math.min(overage, 1);
    }

    if (max) {
      // Within budget - reward being closer to middle of range
      const midpoint = (min + max) / 2;
      const distance = Math.abs(price - midpoint) / (max - min);
      return 20 * (1 - distance);
    }

    return 10; // No max budget specified
  }

  /**
   * Get ML-based recommendations using Azure ML and Surprise library
   * @param {string} userId - User ID
   * @param {Object} intent - User intent
   * @returns {Array} - ML-based recommendations
   */
  async getMLRecommendations(userId, intent) {
    try {
      // Use Python script for collaborative filtering
      const options = {
        mode: 'json',
        pythonPath: 'python3',
        scriptPath: path.join(__dirname, '../scripts'),
        args: [JSON.stringify({
          userId,
          intent,
          numRecommendations: 5
        })]
      };

      const results = await new Promise((resolve, reject) => {
        PythonShell.run('recommender.py', options, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });

      if (results && results[0] && results[0].recommendations) {
        logger.info(`Got ${results[0].recommendations.length} ML recommendations`);
        return results[0].recommendations;
      }

      return [];
    } catch (error) {
      logger.error('ML recommendations failed:', error);
      throw error;
    }
  }

  /**
   * Get product by ID with Wally Score
   * @param {string} productId - Product ID
   * @param {string} userId - User ID for personalization
   * @returns {Object} - Product with Wally Score
   */
  async getProductById(productId, userId) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const user = await User.findById(userId);
      const userPreferences = user ? user.preferences : {};

      const wallyScore = await this.calculateWallyScore(product, userPreferences, {});

      return {
        ...product.toObject(),
        wallyScore
      };
    } catch (error) {
      logger.error('Error getting product by ID:', error);
      throw error;
    }
  }

  /**
   * Compare multiple products
   * @param {Array} productIds - Array of product IDs
   * @param {string} userId - User ID for personalization
   * @returns {Array} - Comparison data for products
   */
  async compareProducts(productIds, userId) {
    try {
      const products = await Promise.all(
        productIds.map(id => this.getProductById(id, userId))
      );

      // Add comparison metadata
      const comparison = {
        products,
        comparisonDate: new Date(),
        criteria: ['price', 'rating', 'wallyScore', 'features']
      };

      logger.info(`Generated comparison for ${products.length} products`);
      return comparison;
    } catch (error) {
      logger.error('Error comparing products:', error);
      throw error;
    }
  }

  /**
   * Get trending/popular products
   * @param {string} category - Optional category filter
   * @param {number} limit - Number of products to return
   * @returns {Array} - Popular products
   */
  async getPopularProducts(category = null, limit = 10) {
    try {
      let query = {};
      if (category && category !== 'general') {
        query.category = category;
      }

      const products = await Product.find(query)
        .sort({ popularity: -1, rating: -1 })
        .limit(limit);

      logger.info(`Retrieved ${products.length} popular products`);
      return products;
    } catch (error) {
      logger.error('Error getting popular products:', error);
      throw error;
    }
  }
}

module.exports = new ProductService();
