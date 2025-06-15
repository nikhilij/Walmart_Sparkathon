const azureSpeech = require('../utils/azureSpeech');
const azureLanguage = require('../utils/azureLanguage');
const azureML = require('../utils/azureML');
const logger = require('../utils/logger');

/**
 * Azure Service - Centralized Azure AI services integration
 * Handles all Azure AI service calls and provides abstraction layer
 */
class AzureService {
  constructor() {
    this.speechService = azureSpeech;
    this.languageService = azureLanguage;
    this.mlService = azureML;
  }

  /**
   * Convert speech to text using Azure AI Speech
   * @param {Buffer} audioBuffer - Audio data buffer
   * @param {Object} options - Speech recognition options
   * @returns {string} - Transcribed text
   */
  async speechToText(audioBuffer, options = {}) {
    try {
      logger.info('Converting speech to text via Azure AI Speech');
      
      const result = await this.speechService.speechToText(audioBuffer, {
        language: options.language || 'en-US',
        format: options.format || 'wav',
        ...options
      });

      logger.info('Speech to text conversion successful');
      return result;
    } catch (error) {
      logger.error('Speech to text conversion failed:', error);
      throw new Error(`Speech recognition failed: ${error.message}`);
    }
  }

  /**
   * Convert text to speech using Azure AI Speech
   * @param {string} text - Text to convert
   * @param {Object} options - Text-to-speech options
   * @returns {Buffer} - Audio buffer
   */
  async textToSpeech(text, options = {}) {
    try {
      logger.info('Converting text to speech via Azure AI Speech');
      
      const result = await this.speechService.textToSpeech(text, {
        voice: options.voice || 'en-US-JennyNeural',
        format: options.format || 'audio-16khz-128kbitrate-mono-mp3',
        ...options
      });

      logger.info('Text to speech conversion successful');
      return result;
    } catch (error) {
      logger.error('Text to speech conversion failed:', error);
      throw new Error(`Speech synthesis failed: ${error.message}`);
    }
  }

  /**
   * Summarize text using Azure AI Language
   * @param {string} text - Text to summarize
   * @param {Object} options - Summarization options
   * @returns {Object} - Summarization result
   */
  async summarizeText(text, options = {}) {
    try {
      logger.info('Summarizing text via Azure AI Language');
      
      const result = await this.languageService.summarizeText(text, {
        maxSentenceCount: options.maxSentenceCount || 3,
        sortBy: options.sortBy || 'Rank',
        ...options
      });

      logger.info('Text summarization successful');
      return result;
    } catch (error) {
      logger.error('Text summarization failed:', error);
      throw new Error(`Text summarization failed: ${error.message}`);
    }
  }

  /**
   * Analyze sentiment using Azure AI Language
   * @param {string} text - Text to analyze
   * @param {Object} options - Sentiment analysis options
   * @returns {Object} - Sentiment analysis result
   */
  async analyzeSentiment(text, options = {}) {
    try {
      logger.info('Analyzing sentiment via Azure AI Language');
      
      const result = await this.languageService.analyzeSentiment(text, {
        language: options.language || 'en',
        includeOpinionMining: options.includeOpinionMining || false,
        ...options
      });

      logger.info('Sentiment analysis successful');
      return result;
    } catch (error) {
      logger.error('Sentiment analysis failed:', error);
      throw new Error(`Sentiment analysis failed: ${error.message}`);
    }
  }

  /**
   * Extract key phrases using Azure AI Language
   * @param {string} text - Text to analyze
   * @param {Object} options - Key phrase extraction options
   * @returns {Array} - Extracted key phrases
   */
  async extractKeyPhrases(text, options = {}) {
    try {
      logger.info('Extracting key phrases via Azure AI Language');
      
      const result = await this.languageService.extractKeyPhrases(text, {
        language: options.language || 'en',
        ...options
      });

      logger.info('Key phrase extraction successful');
      return result;
    } catch (error) {
      logger.error('Key phrase extraction failed:', error);
      throw new Error(`Key phrase extraction failed: ${error.message}`);
    }
  }

  /**
   * Detect language using Azure AI Language
   * @param {string} text - Text to analyze
   * @returns {Object} - Language detection result
   */
  async detectLanguage(text) {
    try {
      logger.info('Detecting language via Azure AI Language');
      
      const result = await this.languageService.detectLanguage(text);

      logger.info('Language detection successful');
      return result;
    } catch (error) {
      logger.error('Language detection failed:', error);
      throw new Error(`Language detection failed: ${error.message}`);
    }
  }

  /**
   * Recognize named entities using Azure AI Language
   * @param {string} text - Text to analyze
   * @param {Object} options - Entity recognition options
   * @returns {Array} - Recognized entities
   */
  async recognizeEntities(text, options = {}) {
    try {
      logger.info('Recognizing entities via Azure AI Language');
      
      const result = await this.languageService.recognizeEntities(text, {
        language: options.language || 'en',
        ...options
      });

      logger.info('Entity recognition successful');
      return result;
    } catch (error) {
      logger.error('Entity recognition failed:', error);
      throw new Error(`Entity recognition failed: ${error.message}`);
    }
  }

  /**
   * Get recommendations using Azure Machine Learning
   * @param {Object} requestData - ML request data
   * @returns {Object} - ML recommendations
   */
  async getMLRecommendations(requestData) {
    try {
      logger.info('Getting ML recommendations via Azure ML');
      
      const result = await this.mlService.getRecommendations(requestData);

      logger.info('ML recommendations retrieved successfully');
      return result;
    } catch (error) {
      logger.error('ML recommendations failed:', error);
      throw new Error(`ML recommendations failed: ${error.message}`);
    }
  }

  /**
   * Train ML model using Azure Machine Learning
   * @param {Object} trainingData - Training data
   * @returns {Object} - Training result
   */
  async trainMLModel(trainingData) {
    try {
      logger.info('Training ML model via Azure ML');
      
      const result = await this.mlService.trainModel(trainingData);

      logger.info('ML model training initiated successfully');
      return result;
    } catch (error) {
      logger.error('ML model training failed:', error);
      throw new Error(`ML model training failed: ${error.message}`);
    }
  }

  /**
   * Batch process multiple texts for various AI operations
   * @param {Array} texts - Array of texts to process
   * @param {string} operation - Type of operation ('sentiment', 'summarize', 'keyPhrases')
   * @param {Object} options - Processing options
   * @returns {Array} - Batch processing results
   */
  async batchProcess(texts, operation, options = {}) {
    try {
      logger.info(`Batch processing ${texts.length} texts for ${operation}`);
      
      const results = [];
      const batchSize = options.batchSize || 10;

      // Process in batches to avoid rate limits
      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        const batchPromises = batch.map(async (text, index) => {
          try {
            let result;
            switch (operation) {
              case 'sentiment':
                result = await this.analyzeSentiment(text, options);
                break;
              case 'summarize':
                result = await this.summarizeText(text, options);
                break;
              case 'keyPhrases':
                result = await this.extractKeyPhrases(text, options);
                break;
              case 'entities':
                result = await this.recognizeEntities(text, options);
                break;
              default:
                throw new Error(`Unsupported operation: ${operation}`);
            }
            return { index: i + index, result, success: true };
          } catch (error) {
            logger.error(`Batch processing failed for text ${i + index}:`, error);
            return { index: i + index, error: error.message, success: false };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);

        // Add delay between batches to respect rate limits
        if (i + batchSize < texts.length && options.delayBetweenBatches !== false) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      logger.info(`Batch processing completed: ${results.filter(r => r.success).length}/${texts.length} successful`);
      return results;
    } catch (error) {
      logger.error('Batch processing failed:', error);
      throw error;
    }
  }

  /**
   * Check service health for all Azure services
   * @returns {Object} - Health status of all services
   */
  async checkServiceHealth() {
    try {
      logger.info('Checking Azure services health');
      
      const health = {
        speech: { status: 'unknown', lastChecked: new Date() },
        language: { status: 'unknown', lastChecked: new Date() },
        ml: { status: 'unknown', lastChecked: new Date() },
        overall: 'unknown'
      };

      // Test Speech service
      try {
        // Simple test - this would depend on your speech service implementation
        await this.speechService.checkHealth();
        health.speech.status = 'healthy';
      } catch (error) {
        health.speech.status = 'unhealthy';
        health.speech.error = error.message;
      }

      // Test Language service
      try {
        const testResult = await this.analyzeSentiment('This is a test');
        health.language.status = testResult ? 'healthy' : 'unhealthy';
      } catch (error) {
        health.language.status = 'unhealthy';
        health.language.error = error.message;
      }

      // Test ML service
      try {
        await this.mlService.checkHealth();
        health.ml.status = 'healthy';
      } catch (error) {
        health.ml.status = 'unhealthy';
        health.ml.error = error.message;
      }

      // Determine overall health
      const healthyServices = Object.values(health)
        .filter(service => service.status === 'healthy').length;
      
      if (healthyServices === 3) {
        health.overall = 'healthy';
      } else if (healthyServices >= 2) {
        health.overall = 'degraded';
      } else {
        health.overall = 'unhealthy';
      }

      logger.info(`Azure services health check completed: ${health.overall}`);
      return health;
    } catch (error) {
      logger.error('Service health check failed:', error);
      return {
        speech: { status: 'error', error: error.message },
        language: { status: 'error', error: error.message },
        ml: { status: 'error', error: error.message },
        overall: 'error',
        lastChecked: new Date()
      };
    }
  }

  /**
   * Get service usage statistics
   * @returns {Object} - Usage statistics for Azure services
   */
  async getServiceUsage() {
    try {
      // This would typically fetch usage data from Azure APIs
      // For now, return mock data
      return {
        speech: {
          requestsToday: 0,
          quotaLimit: 500000,
          quotaRemaining: 500000
        },
        language: {
          requestsToday: 0,
          quotaLimit: 100000,
          quotaRemaining: 100000
        },
        ml: {
          computeHoursUsed: 0,
          quotaLimit: 100,
          quotaRemaining: 100
        },
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error('Error getting service usage:', error);
      throw error;
    }
  }
}

module.exports = new AzureService();
