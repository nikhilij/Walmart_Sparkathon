const azureSpeech = require('../utils/azureSpeech');
const azureLanguage = require('../utils/azureLanguage');
const productService = require('./productService');
const logger = require('../utils/logger');

/**
 * Chat Service - Handles text and voice query processing
 */
class ChatService {
  /**
   * Process user query (text or voice)
   * @param {string} query - User query text
   * @param {string} userId - User ID for personalization
   * @param {boolean} isVoice - Whether the query is from voice input
   * @returns {Object} - Processed response with recommendations
   */
  async processQuery(query, userId, isVoice = false) {
    try {
      logger.info(`Processing ${isVoice ? 'voice' : 'text'} query for user ${userId}: ${query}`);

      // Extract intent and entities from the query
      const intent = await this.extractIntent(query);
      
      // Get product recommendations based on the intent
      const recommendations = await productService.getRecommendations(intent, userId);

      return {
        success: true,
        intent,
        recommendations,
        response: this.generateResponse(intent, recommendations)
      };
    } catch (error) {
      logger.error('Error processing query:', error);
      throw error;
    }
  }

  /**
   * Convert voice to text using Azure Speech service
   * @param {Buffer} audioBuffer - Audio data buffer
   * @returns {string} - Transcribed text
   */
  async voiceToText(audioBuffer) {
    try {
      const transcription = await azureSpeech.speechToText(audioBuffer);
      logger.info('Voice transcription successful');
      return transcription;
    } catch (error) {
      logger.error('Voice transcription failed:', error);
      throw error;
    }
  }

  /**
   * Extract intent and entities from user query
   * @param {string} query - User query text
   * @returns {Object} - Intent and entities
   */
  async extractIntent(query) {
    try {
      // Use Azure Language service for intent detection
      const analysis = await azureLanguage.analyzeText(query);
      
      // Extract budget, category, and other parameters
      const intent = {
        category: this.extractCategory(query),
        budget: this.extractBudget(query),
        preferences: this.extractPreferences(query),
        originalQuery: query,
        entities: analysis.entities || []
      };

      return intent;
    } catch (error) {
      logger.error('Intent extraction failed:', error);
      throw error;
    }
  }

  /**
   * Extract budget from query using regex patterns
   * @param {string} query - User query
   * @returns {Object} - Budget range
   */
  extractBudget(query) {
    const budgetPatterns = [
      /under ₹?(\d+)/i,
      /below ₹?(\d+)/i,
      /less than ₹?(\d+)/i,
      /₹?(\d+)\s*to\s*₹?(\d+)/i,
      /between ₹?(\d+)\s*and\s*₹?(\d+)/i
    ];

    for (const pattern of budgetPatterns) {
      const match = query.match(pattern);
      if (match) {
        if (match[2]) {
          // Range found
          return {
            min: parseInt(match[1]),
            max: parseInt(match[2])
          };
        } else {
          // Upper limit found
          return {
            min: 0,
            max: parseInt(match[1])
          };
        }
      }
    }

    return null;
  }

  /**
   * Extract category from query
   * @param {string} query - User query
   * @returns {string} - Product category
   */
  extractCategory(query) {
    const categories = {
      'electronics': ['phone', 'laptop', 'tablet', 'electronics', 'gadget'],
      'clothing': ['shirt', 'dress', 'clothes', 'fashion', 'wear'],
      'sports': ['shoes', 'running', 'sports', 'fitness', 'gym'],
      'books': ['book', 'novel', 'read', 'literature'],
      'home': ['home', 'kitchen', 'furniture', 'decor']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      for (const keyword of keywords) {
        if (query.toLowerCase().includes(keyword)) {
          return category;
        }
      }
    }

    return 'general';
  }

  /**
   * Extract preferences from query
   * @param {string} query - User query
   * @returns {Array} - User preferences
   */
  extractPreferences(query) {
    const preferences = [];
    const query_lower = query.toLowerCase();

    // Gender preferences
    if (query_lower.includes('sister') || query_lower.includes('girl') || query_lower.includes('woman')) {
      preferences.push('female');
    }
    if (query_lower.includes('brother') || query_lower.includes('boy') || query_lower.includes('man')) {
      preferences.push('male');
    }

    // Age preferences
    if (query_lower.includes('kid') || query_lower.includes('child')) {
      preferences.push('kids');
    }
    if (query_lower.includes('teen') || query_lower.includes('teenager')) {
      preferences.push('teenager');
    }

    // Occasion preferences
    if (query_lower.includes('gift') || query_lower.includes('present')) {
      preferences.push('gift');
    }
    if (query_lower.includes('birthday')) {
      preferences.push('birthday');
    }

    return preferences;
  }

  /**
   * Generate natural language response
   * @param {Object} intent - Extracted intent
   * @param {Array} recommendations - Product recommendations
   * @returns {string} - Natural language response
   */
  generateResponse(intent, recommendations) {
    if (!recommendations || recommendations.length === 0) {
      return "I couldn't find any products matching your criteria. Could you try a different search?";
    }

    const budgetText = intent.budget ? 
      `under ₹${intent.budget.max}` : 
      'within your budget';

    const categoryText = intent.category !== 'general' ? 
      `in ${intent.category}` : 
      '';

    return `I found ${recommendations.length} great ${categoryText} options ${budgetText}. Here are my top recommendations with their Wally Scores:`;
  }

  /**
   * Get user chat history
   * @param {string} userId - User ID
   * @param {number} limit - Number of recent queries to retrieve
   * @returns {Array} - Chat history
   */
  async getChatHistory(userId, limit = 10) {
    try {
      // This would typically fetch from a database
      // For now, return empty array as it's not implemented
      logger.info(`Fetching chat history for user ${userId}`);
      return [];
    } catch (error) {
      logger.error('Error fetching chat history:', error);
      throw error;
    }
  }
}

module.exports = new ChatService();
