const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

/**
 * Rate limiting middleware configuration
 */

// General rate limiter for all requests
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per 15 minutes
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: 15 * 60 // seconds
    },
    handler: (req, res) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`);
        res.status(429).json({
            success: false,
            error: 'Too many requests from this IP, please try again later.',
            retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
        });
    }
});

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per 15 minutes
    skipSuccessfulRequests: true, // Don't count successful requests
    message: {
        success: false,
        error: 'Too many authentication attempts, please try again later.',
        retryAfter: 15 * 60
    },
    handler: (req, res) => {
        logger.warn(`Auth rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`);
        res.status(429).json({
            success: false,
            error: 'Too many authentication attempts from this IP, please try again later.',
            retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
        });
    }
});

// Rate limiter for Azure AI service calls (more restrictive)
const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 AI requests per minute
    message: {
        success: false,
        error: 'Too many AI service requests, please slow down.',
        retryAfter: 60
    },
    handler: (req, res) => {
        logger.warn(`AI service rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`);
        res.status(429).json({
            success: false,
            error: 'Too many AI service requests from this IP, please slow down.',
            retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
        });
    }
});

module.exports = {
    generalLimiter,
    authLimiter,
    aiLimiter
};