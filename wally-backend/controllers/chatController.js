const { chatService } = require('../services');
const logger = require('../utils/logger');

/**
 * Chat Controller - Handles text and voice query endpoints
 */

/**
 * Handle text query from user
 */
exports.handleTextQuery = async (req, res) => {
    try {
        const { query } = req.body;
        const userId = req.user?.userId || 'anonymous'; // From auth middleware

        if (!query || query.trim().length === 0) {
            return res.status(400).json({ 
                error: 'Query is required and cannot be empty' 
            });
        }

        const result = await chatService.processQuery(query, userId, false);
        
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        logger.error('Error handling text query:', error);
        res.status(500).json({ 
            success: false,
            error: 'An error occurred while processing the text query.',
            message: error.message
        });
    }
};

/**
 * Handle voice query from user
 */
exports.handleVoiceQuery = async (req, res) => {
    try {
        const audioData = req.body.audio || req.file; // Audio data from request
        const userId = req.user?.userId || 'anonymous';

        if (!audioData) {
            return res.status(400).json({ 
                error: 'Audio data is required' 
            });
        }

        // Convert voice to text first
        const transcription = await chatService.voiceToText(audioData);
        
        // Process the transcribed query
        const result = await chatService.processQuery(transcription, userId, true);
        
        res.status(200).json({
            success: true,
            transcription,
            data: result
        });
    } catch (error) {
        logger.error('Error handling voice query:', error);
        res.status(500).json({ 
            success: false,
            error: 'An error occurred while processing the voice query.',
            message: error.message
        });
    }
};

/**
 * Get user's chat history
 */
exports.getChatHistory = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const limit = parseInt(req.query.limit) || 10;

        if (!userId) {
            return res.status(401).json({ 
                error: 'Authentication required' 
            });
        }

        const history = await chatService.getChatHistory(userId, limit);
        
        res.status(200).json({
            success: true,
            data: history
        });
    } catch (error) {
        logger.error('Error getting chat history:', error);
        res.status(500).json({ 
            success: false,
            error: 'An error occurred while retrieving chat history.',
            message: error.message
        });
    }
};