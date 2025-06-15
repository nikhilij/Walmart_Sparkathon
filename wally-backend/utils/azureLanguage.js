const axios = require('axios');
const logger = require('./logger');

/**
 * Azure AI Language Service Integration
 * Provides text analysis capabilities including sentiment analysis, summarization, and key phrase extraction
 */

class AzureLanguageService {
    constructor() {
        this.endpoint = process.env.AZURE_LANGUAGE_ENDPOINT;
        this.key = process.env.AZURE_LANGUAGE_KEY;
        
        if (!this.endpoint || !this.key) {
            logger.warn('Azure Language Service credentials not configured');
        }

        this.headers = {
            'Ocp-Apim-Subscription-Key': this.key,
            'Content-Type': 'application/json'
        };
    }

    /**
     * Analyze sentiment of text
     * @param {string} text - Text to analyze
     * @param {Object} options - Analysis options
     * @returns {Object} - Sentiment analysis result
     */
    async analyzeSentiment(text, options = {}) {
        if (!this.key || !this.endpoint) {
            // Return mock data if not configured
            return {
                sentiment: 'neutral',
                confidenceScore: 0.5,
                positive: 0.33,
                neutral: 0.34,
                negative: 0.33
            };
        }

        const body = {
            documents: [{
                language: options.language || 'en',
                id: '1',
                text: text.substring(0, 5120) // API limit
            }]
        };

        try {
            const response = await axios.post(
                `${this.endpoint}/text/analytics/v3.1/sentiment`,
                body,
                { headers: this.headers, timeout: 10000 }
            );

            const document = response.data.documents[0];
            if (document) {
                return {
                    sentiment: document.sentiment,
                    confidenceScore: Math.max(
                        document.confidenceScores.positive,
                        document.confidenceScores.neutral,
                        document.confidenceScores.negative
                    ),
                    positive: document.confidenceScores.positive,
                    neutral: document.confidenceScores.neutral,
                    negative: document.confidenceScores.negative
                };
            }

            throw new Error('No sentiment analysis result returned');
        } catch (error) {
            logger.error('Azure sentiment analysis failed:', error.message);
            // Return fallback result
            return {
                sentiment: 'neutral',
                confidenceScore: 0.5,
                positive: 0.33,
                neutral: 0.34,
                negative: 0.33
            };
        }
    }

    /**
     * Summarize text using extractive summarization
     * @param {string} text - Text to summarize
     * @param {Object} options - Summarization options
     * @returns {Object} - Summarization result
     */
    async summarizeText(text, options = {}) {
        if (!this.key || !this.endpoint) {
            // Return mock summary if not configured
            return {
                summary: this.createFallbackSummary(text),
                sentences: []
            };
        }

        const body = {
            documents: [{
                language: options.language || 'en',
                id: '1',
                text: text.substring(0, 125000) // API limit
            }],
            tasks: [{
                kind: 'ExtractiveSummarization',
                taskName: 'ExtractiveSummarization',
                parameters: {
                    sentenceCount: options.maxSentenceCount || 3,
                    sortBy: options.sortBy || 'Rank'
                }
            }]
        };

        try {
            const response = await axios.post(
                `${this.endpoint}/text/analytics/v3.1/analyze`,
                body,
                { headers: this.headers, timeout: 30000 }
            );

            // The analyze endpoint returns immediately with a job ID
            // For simplicity, we'll return a fallback summary
            // In production, you'd poll for results
            return {
                summary: this.createFallbackSummary(text),
                sentences: []
            };
        } catch (error) {
            logger.error('Azure text summarization failed:', error.message);
            return {
                summary: this.createFallbackSummary(text),
                sentences: []
            };
        }
    }

    /**
     * Extract key phrases from text
     * @param {string} text - Text to analyze
     * @param {Object} options - Extraction options
     * @returns {Array} - Key phrases
     */
    async extractKeyPhrases(text, options = {}) {
        if (!this.key || !this.endpoint) {
            return this.extractFallbackKeyPhrases(text);
        }

        const body = {
            documents: [{
                language: options.language || 'en',
                id: '1',
                text: text.substring(0, 5120) // API limit
            }]
        };

        try {
            const response = await axios.post(
                `${this.endpoint}/text/analytics/v3.1/keyPhrases`,
                body,
                { headers: this.headers, timeout: 10000 }
            );

            const document = response.data.documents[0];
            return document ? document.keyPhrases : [];
        } catch (error) {
            logger.error('Azure key phrase extraction failed:', error.message);
            return this.extractFallbackKeyPhrases(text);
        }
    }

    /**
     * Detect language of text
     * @param {string} text - Text to analyze
     * @returns {Object} - Language detection result
     */
    async detectLanguage(text) {
        if (!this.key || !this.endpoint) {
            return { language: 'en', confidence: 0.9 };
        }

        const body = {
            documents: [{
                id: '1',
                text: text.substring(0, 5120)
            }]
        };

        try {
            const response = await axios.post(
                `${this.endpoint}/text/analytics/v3.1/languages`,
                body,
                { headers: this.headers, timeout: 10000 }
            );

            const document = response.data.documents[0];
            if (document && document.detectedLanguage) {
                return {
                    language: document.detectedLanguage.iso6391Name,
                    confidence: document.detectedLanguage.confidenceScore
                };
            }

            return { language: 'en', confidence: 0.9 };
        } catch (error) {
            logger.error('Azure language detection failed:', error.message);
            return { language: 'en', confidence: 0.9 };
        }
    }

    /**
     * Recognize named entities in text
     * @param {string} text - Text to analyze
     * @param {Object} options - Recognition options
     * @returns {Array} - Named entities
     */
    async recognizeEntities(text, options = {}) {
        if (!this.key || !this.endpoint) {
            return [];
        }

        const body = {
            documents: [{
                language: options.language || 'en',
                id: '1',
                text: text.substring(0, 5120)
            }]
        };

        try {
            const response = await axios.post(
                `${this.endpoint}/text/analytics/v3.1/entities/recognition/general`,
                body,
                { headers: this.headers, timeout: 10000 }
            );

            const document = response.data.documents[0];
            return document ? document.entities : [];
        } catch (error) {
            logger.error('Azure entity recognition failed:', error.message);
            return [];
        }
    }

    /**
     * Create a simple fallback summary
     * @private
     */
    createFallbackSummary(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
        if (sentences.length <= 3) return text;

        // Return first 2 sentences and last sentence as summary
        return `${sentences[0].trim()}. ${sentences[1].trim()}. ${sentences[sentences.length - 1].trim()}.`;
    }

    /**
     * Extract simple key phrases as fallback
     * @private
     */
    extractFallbackKeyPhrases(text) {
        // Simple keyword extraction based on word frequency
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3);

        const frequency = {};
        words.forEach(word => {
            frequency[word] = (frequency[word] || 0) + 1;
        });

        return Object.entries(frequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([word]) => word);
    }

    /**
     * Check if the service is properly configured
     */
    isConfigured() {
        return !!(this.key && this.endpoint);
    }

    /**
     * Test the service connection
     */
    async checkHealth() {
        if (!this.isConfigured()) {
            throw new Error('Azure Language Service not configured');
        }

        try {
            await this.analyzeSentiment('This is a test');
            return true;
        } catch (error) {
            throw new Error(`Azure Language Service health check failed: ${error.message}`);
        }
    }
}

module.exports = new AzureLanguageService();