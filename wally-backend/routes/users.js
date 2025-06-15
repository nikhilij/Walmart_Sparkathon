const express = require('express');
const router = express.Router();
const { userService } = require('../services');
const { authenticate } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const logger = require('../utils/logger');

/**
 * User Routes - Handles user authentication, profile management
 */

/**
 * Register a new user
 */
router.post('/register', authLimiter, validateUserRegistration, async (req, res) => {
    try {
        const { email, password, name, preferences } = req.body;

        const result = await userService.createUser({
            email,
            password,
            name,
            preferences
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result
        });
    } catch (error) {
        logger.error('User registration error:', error);
        
        if (error.message === 'User already exists with this email') {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

/**
 * Login user
 */
router.post('/login', authLimiter, validateUserLogin, async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await userService.authenticateUser(email, password);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result
        });
    } catch (error) {
        logger.error('User login error:', error);
        
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
});

/**
 * Get current user profile
 */
router.get('/profile', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await userService.getUserById(userId);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        logger.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user profile',
            error: error.message
        });
    }
});

/**
 * Update user profile
 */
router.put('/profile', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;
        const updateData = req.body;

        const updatedUser = await userService.updateUserProfile(userId, updateData);

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (error) {
        logger.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
});

/**
 * Update user preferences
 */
router.put('/preferences', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;
        const preferences = req.body;

        const updatedUser = await userService.updateUserPreferences(userId, preferences);

        res.status(200).json({
            success: true,
            message: 'Preferences updated successfully',
            data: updatedUser
        });
    } catch (error) {
        logger.error('Update preferences error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update preferences',
            error: error.message
        });
    }
});

/**
 * Get user shopping history
 */
router.get('/history', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;
        const limit = parseInt(req.query.limit) || 20;

        const history = await userService.getUserShoppingHistory(userId, limit);

        res.status(200).json({
            success: true,
            data: history
        });
    } catch (error) {
        logger.error('Get shopping history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get shopping history',
            error: error.message
        });
    }
});

/**
 * Add item to shopping history
 */
router.post('/history', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;
        const item = req.body;

        await userService.addToShoppingHistory(userId, item);

        res.status(200).json({
            success: true,
            message: 'Item added to shopping history'
        });
    } catch (error) {
        logger.error('Add to shopping history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add item to shopping history',
            error: error.message
        });
    }
});

/**
 * Get personalized recommendations
 */
router.get('/recommendations', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;

        const recommendations = await userService.getPersonalizedRecommendations(userId);

        res.status(200).json({
            success: true,
            data: recommendations
        });
    } catch (error) {
        logger.error('Get personalized recommendations error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get recommendations',
            error: error.message
        });
    }
});

/**
 * Delete user account
 */
router.delete('/account', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;

        await userService.deleteUser(userId);

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        logger.error('Delete account error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete account',
            error: error.message
        });
    }
});

module.exports = router;
