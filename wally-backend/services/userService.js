const User = require('../models/User');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * User Service - Handles user management, preferences, and authentication
 */
class UserService {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Object} - Created user
   */
  async createUser(userData) {
    try {
      const { email, password, name, preferences = {} } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = new User({
        email,
        password: hashedPassword,
        name,
        preferences: {
          favoriteCategories: preferences.favoriteCategories || [],
          budgetRange: preferences.budgetRange || { min: 0, max: 10000 },
          brands: preferences.brands || [],
          ...preferences
        }
      });

      await user.save();

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      logger.info(`Created new user: ${email}`);
      return userResponse;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Authenticate user and generate JWT token
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object} - Authentication result with token
   */
  async authenticateUser(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user._id, 
          email: user.email 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      logger.info(`User authenticated: ${email}`);
      return {
        user: userResponse,
        token
      };
    } catch (error) {
      logger.error('Error authenticating user:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Object} - User data
   */
  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      logger.error('Error getting user by ID:', error);
      throw error;
    }
  }

  /**
   * Update user preferences
   * @param {string} userId - User ID
   * @param {Object} preferences - New preferences
   * @returns {Object} - Updated user
   */
  async updateUserPreferences(userId, preferences) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Merge new preferences with existing ones
      user.preferences = {
        ...user.preferences,
        ...preferences
      };

      await user.save();

      const userResponse = user.toObject();
      delete userResponse.password;

      logger.info(`Updated preferences for user: ${userId}`);
      return userResponse;
    } catch (error) {
      logger.error('Error updating user preferences:', error);
      throw error;
    }
  }

  /**
   * Get user shopping history
   * @param {string} userId - User ID
   * @param {number} limit - Number of records to return
   * @returns {Array} - Shopping history
   */
  async getUserShoppingHistory(userId, limit = 20) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Return recent shopping history
      const history = user.shoppingHistory || [];
      return history
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
    } catch (error) {
      logger.error('Error getting shopping history:', error);
      throw error;
    }
  }

  /**
   * Add item to user shopping history
   * @param {string} userId - User ID
   * @param {Object} item - Shopping item
   * @returns {Object} - Updated user
   */
  async addToShoppingHistory(userId, item) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (!user.shoppingHistory) {
        user.shoppingHistory = [];
      }

      // Add new item to history
      user.shoppingHistory.push({
        ...item,
        date: new Date()
      });

      // Keep only last 100 items
      if (user.shoppingHistory.length > 100) {
        user.shoppingHistory = user.shoppingHistory.slice(-100);
      }

      await user.save();

      logger.info(`Added item to shopping history for user: ${userId}`);
      return user.toObject();
    } catch (error) {
      logger.error('Error adding to shopping history:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Object} - Updated user
   */
  async updateUserProfile(userId, updateData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Update allowed fields
      const allowedFields = ['name', 'phone', 'address', 'dateOfBirth'];
      allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
          user[field] = updateData[field];
        }
      });

      await user.save();

      const userResponse = user.toObject();
      delete userResponse.password;

      logger.info(`Updated profile for user: ${userId}`);
      return userResponse;
    } catch (error) {
      logger.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Get personalized recommendations based on user history and preferences
   * @param {string} userId - User ID
   * @returns {Object} - Personalized recommendations
   */
  async getPersonalizedRecommendations(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const preferences = user.preferences || {};
      const shoppingHistory = user.shoppingHistory || [];

      // Analyze user behavior
      const analysis = {
        favoriteCategories: preferences.favoriteCategories || [],
        budgetRange: preferences.budgetRange || { min: 0, max: 10000 },
        recentCategories: this.extractRecentCategories(shoppingHistory),
        avgSpending: this.calculateAverageSpending(shoppingHistory),
        shoppingFrequency: this.calculateShoppingFrequency(shoppingHistory)
      };

      logger.info(`Generated personalized recommendations for user: ${userId}`);
      return analysis;
    } catch (error) {
      logger.error('Error getting personalized recommendations:', error);
      throw error;
    }
  }

  /**
   * Extract recent categories from shopping history
   * @param {Array} shoppingHistory - User shopping history
   * @returns {Array} - Recent categories
   */
  extractRecentCategories(shoppingHistory) {
    const recentItems = shoppingHistory
      .filter(item => {
        const itemDate = new Date(item.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return itemDate > thirtyDaysAgo;
      })
      .map(item => item.category)
      .filter(category => category);

    // Count category frequency
    const categoryCount = {};
    recentItems.forEach(category => {
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    // Return sorted by frequency
    return Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .map(([category]) => category);
  }

  /**
   * Calculate average spending from shopping history
   * @param {Array} shoppingHistory - User shopping history
   * @returns {number} - Average spending
   */
  calculateAverageSpending(shoppingHistory) {
    if (shoppingHistory.length === 0) return 0;

    const totalSpent = shoppingHistory
      .filter(item => item.price)
      .reduce((sum, item) => sum + item.price, 0);

    return totalSpent / shoppingHistory.length;
  }

  /**
   * Calculate shopping frequency
   * @param {Array} shoppingHistory - User shopping history
   * @returns {string} - Shopping frequency description
   */
  calculateShoppingFrequency(shoppingHistory) {
    if (shoppingHistory.length === 0) return 'none';

    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const recentPurchases = shoppingHistory.filter(item => 
      new Date(item.date) > lastMonth
    );

    if (recentPurchases.length > 10) return 'high';
    if (recentPurchases.length > 3) return 'medium';
    if (recentPurchases.length > 0) return 'low';
    return 'none';
  }

  /**
   * Delete user account
   * @param {string} userId - User ID
   * @returns {boolean} - Success status
   */
  async deleteUser(userId) {
    try {
      const result = await User.findByIdAndDelete(userId);
      if (!result) {
        throw new Error('User not found');
      }

      logger.info(`Deleted user: ${userId}`);
      return true;
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }
}

module.exports = new UserService();
