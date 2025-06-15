const Review = require('../models/Review');
const Product = require('../models/Product');
const azureLanguage = require('../utils/azureLanguage');
const logger = require('../utils/logger');

/**
 * Review Service - Handles review summarization and fake review detection
 */
class ReviewService {
  /**
   * Generate AI summary of product reviews
   * @param {string} productId - Product ID
   * @param {number} limit - Maximum number of reviews to analyze
   * @returns {Object} - Review summary with pros, cons, and overall sentiment
   */
  async summarizeReviews(productId, limit = 50) {
    try {
      logger.info(`Generating review summary for product ${productId}`);

      // Get product reviews
      const reviews = await Review.find({ productId })
        .sort({ createdAt: -1, helpfulCount: -1 })
        .limit(limit);

      if (reviews.length === 0) {
        return {
          summary: 'No reviews available for this product.',
          sentiment: 'neutral',
          totalReviews: 0,
          averageRating: 0,
          pros: [],
          cons: []
        };
      }

      // Combine review texts for summarization
      const reviewTexts = reviews.map(review => review.text).join('\n\n');

      // Use Azure AI Language for summarization
      const summary = await azureLanguage.summarizeText(reviewTexts);
      
      // Analyze sentiment
      const sentiment = await azureLanguage.analyzeSentiment(reviewTexts);

      // Extract pros and cons from reviews
      const { pros, cons } = await this.extractProsAndCons(reviews);

      // Calculate statistics
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

      const result = {
        summary: summary.summary || 'Unable to generate summary.',
        sentiment: sentiment.sentiment || 'neutral',
        confidenceScore: sentiment.confidenceScore || 0,
        totalReviews: reviews.length,
        averageRating: Math.round(averageRating * 10) / 10,
        pros: pros.slice(0, 5), // Top 5 pros
        cons: cons.slice(0, 5), // Top 5 cons
        lastUpdated: new Date()
      };

      logger.info(`Generated review summary with ${pros.length} pros and ${cons.length} cons`);
      return result;
    } catch (error) {
      logger.error('Error summarizing reviews:', error);
      throw error;
    }
  }

  /**
   * Calculate trust score for reviews and detect fake reviews
   * @param {string} productId - Product ID
   * @returns {Object} - Trust analysis with overall score and flagged reviews
   */
  async calculateTrustScore(productId) {
    try {
      logger.info(`Calculating trust score for product ${productId}`);

      const reviews = await Review.find({ productId });

      if (reviews.length === 0) {
        return {
          overallTrustScore: 100,
          totalReviews: 0,
          flaggedReviews: [],
          trustFactors: {
            reviewPatterns: 'no-data',
            sentimentConsistency: 'no-data',
            reviewerCredibility: 'no-data'
          }
        };
      }

      // Analyze each review for fake indicators
      const reviewAnalysis = await Promise.all(
        reviews.map(review => this.analyzeReviewTrust(review))
      );

      // Calculate overall trust score
      const trustScores = reviewAnalysis.map(analysis => analysis.trustScore);
      const overallTrustScore = trustScores.reduce((sum, score) => sum + score, 0) / trustScores.length;

      // Identify flagged (potentially fake) reviews
      const flaggedReviews = reviewAnalysis
        .filter(analysis => analysis.trustScore < 50)
        .map(analysis => ({
          reviewId: analysis.reviewId,
          trustScore: analysis.trustScore,
          flags: analysis.flags,
          text: analysis.text.substring(0, 100) + '...'
        }));

      // Analyze trust factors
      const trustFactors = this.analyzeTrustFactors(reviews, reviewAnalysis);

      const result = {
        overallTrustScore: Math.round(overallTrustScore),
        totalReviews: reviews.length,
        flaggedReviews,
        trustFactors,
        analysisDate: new Date()
      };

      logger.info(`Trust score: ${result.overallTrustScore}%, flagged ${flaggedReviews.length} reviews`);
      return result;
    } catch (error) {
      logger.error('Error calculating trust score:', error);
      throw error;
    }
  }

  /**
   * Analyze individual review for trust indicators
   * @param {Object} review - Review object
   * @returns {Object} - Trust analysis for single review
   */
  async analyzeReviewTrust(review) {
    try {
      let trustScore = 100;
      const flags = [];

      // Check review length (very short or very long reviews can be suspicious)
      if (review.text.length < 20) {
        trustScore -= 20;
        flags.push('too-short');
      } else if (review.text.length > 2000) {
        trustScore -= 10;
        flags.push('too-long');
      }

      // Use Azure AI Language for sentiment analysis
      const sentiment = await azureLanguage.analyzeSentiment(review.text);

      // Check for extreme sentiment (very positive/negative can be fake)
      if (sentiment.confidenceScore > 0.95) {
        if (sentiment.sentiment === 'positive' && review.rating < 3) {
          trustScore -= 30;
          flags.push('sentiment-rating-mismatch');
        } else if (sentiment.sentiment === 'negative' && review.rating > 3) {
          trustScore -= 30;
          flags.push('sentiment-rating-mismatch');
        }
      }

      // Check for suspicious patterns
      const suspiciousPatterns = [
        /(.)\1{4,}/g, // Repeated characters (aaaaa)
        /^.{1,10}$/g, // Very short reviews
        /(amazing|awesome|fantastic|terrible|worst|horrible|perfect|excellent){3,}/gi // Repeated extreme adjectives
      ];

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(review.text)) {
          trustScore -= 15;
          flags.push('suspicious-pattern');
          break;
        }
      }

      // Check reviewer history (if available)
      if (review.reviewerId) {
        const reviewerReviews = await Review.find({ reviewerId: review.reviewerId });
        
        // Suspicious if reviewer has many reviews in short time period
        if (reviewerReviews.length > 10) {
          const recentReviews = reviewerReviews.filter(r => 
            (new Date() - new Date(r.createdAt)) < (7 * 24 * 60 * 60 * 1000) // 7 days
          );
          
          if (recentReviews.length > 5) {
            trustScore -= 25;
            flags.push('prolific-reviewer');
          }
        }
      }

      // Check for verified purchase (if available)
      if (review.verifiedPurchase === false) {
        trustScore -= 20;
        flags.push('unverified-purchase');
      }

      return {
        reviewId: review._id,
        trustScore: Math.max(0, trustScore),
        flags,
        text: review.text,
        sentiment: sentiment.sentiment,
        confidenceScore: sentiment.confidenceScore
      };
    } catch (error) {
      logger.error('Error analyzing review trust:', error);
      return {
        reviewId: review._id,
        trustScore: 50, // Default neutral score
        flags: ['analysis-error'],
        text: review.text
      };
    }
  }

  /**
   * Extract pros and cons from reviews
   * @param {Array} reviews - Array of review objects
   * @returns {Object} - Extracted pros and cons
   */
  async extractProsAndCons(reviews) {
    try {
      const pros = [];
      const cons = [];

      // Simple keyword-based extraction
      const prosKeywords = ['good', 'great', 'excellent', 'amazing', 'love', 'perfect', 'awesome', 'fantastic'];
      const consKeywords = ['bad', 'terrible', 'awful', 'hate', 'poor', 'worst', 'horrible', 'disappointing'];

      for (const review of reviews) {
        const sentences = review.text.split(/[.!?]+/);
        
        for (const sentence of sentences) {
          const lowerSentence = sentence.toLowerCase().trim();
          
          if (lowerSentence.length < 10) continue; // Skip very short sentences
          
          // Check for pros
          const hasProKeyword = prosKeywords.some(keyword => lowerSentence.includes(keyword));
          if (hasProKeyword && review.rating >= 4) {
            pros.push(sentence.trim());
          }
          
          // Check for cons
          const hasConKeyword = consKeywords.some(keyword => lowerSentence.includes(keyword));
          if (hasConKeyword && review.rating <= 2) {
            cons.push(sentence.trim());
          }
        }
      }

      // Remove duplicates and sort by relevance (length as proxy)
      const uniquePros = [...new Set(pros)].sort((a, b) => b.length - a.length);
      const uniqueCons = [...new Set(cons)].sort((a, b) => b.length - a.length);

      return {
        pros: uniquePros,
        cons: uniqueCons
      };
    } catch (error) {
      logger.error('Error extracting pros and cons:', error);
      return { pros: [], cons: [] };
    }
  }

  /**
   * Analyze overall trust factors for a product's reviews
   * @param {Array} reviews - All reviews for the product
   * @param {Array} reviewAnalysis - Trust analysis for each review
   * @returns {Object} - Trust factors analysis
   */
  analyzeTrustFactors(reviews, reviewAnalysis) {
    const factors = {
      reviewPatterns: 'good',
      sentimentConsistency: 'good',
      reviewerCredibility: 'good',
      timeDistribution: 'good'
    };

    // Check review patterns
    const flaggedCount = reviewAnalysis.filter(analysis => analysis.trustScore < 50).length;
    const flaggedPercentage = (flaggedCount / reviews.length) * 100;

    if (flaggedPercentage > 30) {
      factors.reviewPatterns = 'poor';
    } else if (flaggedPercentage > 15) {
      factors.reviewPatterns = 'fair';
    }

    // Check sentiment consistency
    const sentiments = reviewAnalysis.map(analysis => analysis.sentiment);
    const positiveCount = sentiments.filter(s => s === 'positive').length;
    const negativeCount = sentiments.filter(s => s === 'negative').length;
    const neutralCount = sentiments.filter(s => s === 'neutral').length;

    const maxSentiment = Math.max(positiveCount, negativeCount, neutralCount);
    const sentimentSkew = maxSentiment / reviews.length;

    if (sentimentSkew > 0.9) {
      factors.sentimentConsistency = 'suspicious'; // Too uniform
    } else if (sentimentSkew > 0.7) {
      factors.sentimentConsistency = 'fair';
    }

    // Check time distribution
    const now = new Date();
    const recentReviews = reviews.filter(review => 
      (now - new Date(review.createdAt)) < (30 * 24 * 60 * 60 * 1000) // 30 days
    );

    if (recentReviews.length > reviews.length * 0.8) {
      factors.timeDistribution = 'suspicious'; // Too many recent reviews
    }

    return factors;
  }

  /**
   * Get detailed review analysis for a specific review
   * @param {string} reviewId - Review ID
   * @returns {Object} - Detailed review analysis
   */
  async getReviewAnalysis(reviewId) {
    try {
      const review = await Review.findById(reviewId);
      if (!review) {
        throw new Error('Review not found');
      }

      const analysis = await this.analyzeReviewTrust(review);
      const sentiment = await azureLanguage.analyzeSentiment(review.text);

      return {
        ...analysis,
        detailedSentiment: sentiment,
        reviewData: review
      };
    } catch (error) {
      logger.error('Error getting review analysis:', error);
      throw error;
    }
  }

  /**
   * Get reviews for a product with trust scores
   * @param {string} productId - Product ID
   * @param {Object} options - Query options
   * @returns {Array} - Reviews with trust scores
   */
  async getReviewsWithTrustScores(productId, options = {}) {
    try {
      const { limit = 20, sort = '-createdAt', minTrustScore = 0 } = options;

      const reviews = await Review.find({ productId })
        .sort(sort)
        .limit(limit);

      const reviewsWithTrust = await Promise.all(
        reviews.map(async (review) => {
          const analysis = await this.analyzeReviewTrust(review);
          
          if (analysis.trustScore >= minTrustScore) {
            return {
              ...review.toObject(),
              trustScore: analysis.trustScore,
              flags: analysis.flags
            };
          }
          return null;
        })
      );

      return reviewsWithTrust.filter(review => review !== null);
    } catch (error) {
      logger.error('Error getting reviews with trust scores:', error);
      throw error;
    }
  }
}

module.exports = new ReviewService();
