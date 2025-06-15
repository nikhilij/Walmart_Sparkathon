const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { validateChatInput } = require('../middleware/validate');

/**
 * Chat Routes - Handles text and voice query endpoints
 */

// Route for processing text queries
router.post('/text', optionalAuth, validateChatInput, chatController.handleTextQuery);

// Route for processing voice queries
router.post('/voice', optionalAuth, chatController.handleVoiceQuery);

// Route for getting chat history (protected)
router.get('/history', authenticate, chatController.getChatHistory);

// Export the router
module.exports = router;