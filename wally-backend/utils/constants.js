/**
 * Application Constants
 * Centralized constants for error codes, messages, and configuration
 */

module.exports = {
    // HTTP Status Codes
    HTTP_STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        TOO_MANY_REQUESTS: 429,
        INTERNAL_SERVER_ERROR: 500,
        SERVICE_UNAVAILABLE: 503
    },

    // Error Codes
    ERROR_CODES: {
        USER_NOT_FOUND: 'USER_NOT_FOUND',
        USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
        PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
        REVIEW_NOT_FOUND: 'REVIEW_NOT_FOUND',
        INVALID_INPUT: 'INVALID_INPUT',
        INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
        TOKEN_EXPIRED: 'TOKEN_EXPIRED',
        TOKEN_INVALID: 'TOKEN_INVALID',
        UNAUTHORIZED: 'UNAUTHORIZED',
        FORBIDDEN: 'FORBIDDEN',
        RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
        INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
        SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
        VALIDATION_ERROR: 'VALIDATION_ERROR',
        DATABASE_ERROR: 'DATABASE_ERROR',
        AZURE_SERVICE_ERROR: 'AZURE_SERVICE_ERROR'
    },

    // Error Messages
    ERROR_MESSAGES: {
        USER_NOT_FOUND: 'User not found.',
        USER_ALREADY_EXISTS: 'User already exists with this email.',
        PRODUCT_NOT_FOUND: 'Product not found.',
        REVIEW_NOT_FOUND: 'Review not found.',
        INVALID_INPUT: 'Invalid input provided.',
        INVALID_CREDENTIALS: 'Invalid email or password.',
        TOKEN_EXPIRED: 'Token has expired.',
        TOKEN_INVALID: 'Invalid token.',
        UNAUTHORIZED: 'Authentication required.',
        FORBIDDEN: 'Access to this resource is forbidden.',
        RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
        INTERNAL_SERVER_ERROR: 'An internal server error occurred.',
        SERVICE_UNAVAILABLE: 'Service is temporarily unavailable.',
        VALIDATION_ERROR: 'Validation failed.',
        DATABASE_ERROR: 'Database operation failed.',
        AZURE_SERVICE_ERROR: 'Azure service is unavailable.'
    },

    // Success Messages
    SUCCESS_MESSAGES: {
        USER_CREATED: 'User registered successfully.',
        USER_UPDATED: 'User updated successfully.',
        USER_DELETED: 'User deleted successfully.',
        LOGIN_SUCCESS: 'Login successful.',
        LOGOUT_SUCCESS: 'Logout successful.',
        PRODUCT_RETRIEVED: 'Product retrieved successfully.',
        PRODUCTS_RETRIEVED: 'Products retrieved successfully.',
        RECOMMENDATIONS_GENERATED: 'Recommendations generated successfully.',
        REVIEW_CREATED: 'Review submitted successfully.',
        REVIEW_UPDATED: 'Review updated successfully.',
        REVIEW_DELETED: 'Review deleted successfully.',
        REVIEWS_SUMMARIZED: 'Reviews summarized successfully.',
        TRUST_SCORE_CALCULATED: 'Trust score calculated successfully.',
        CHAT_PROCESSED: 'Query processed successfully.',
        PREFERENCES_UPDATED: 'Preferences updated successfully.'
    },

    // Product Categories
    PRODUCT_CATEGORIES: {
        ELECTRONICS: 'electronics',
        CLOTHING: 'clothing',
        SPORTS: 'sports',
        BOOKS: 'books',
        HOME: 'home',
        GENERAL: 'general'
    },

    // User Roles
    USER_ROLES: {
        USER: 'user',
        ADMIN: 'admin'
    },

    // Review Statuses
    REVIEW_STATUS: {
        PENDING: 'pending',
        APPROVED: 'approved',
        REJECTED: 'rejected',
        FLAGGED: 'flagged'
    },

    // Sentiment Labels
    SENTIMENT_LABELS: {
        POSITIVE: 'positive',
        NEGATIVE: 'negative',
        NEUTRAL: 'neutral'
    },

    // Trust Score Thresholds
    TRUST_SCORE: {
        HIGH_TRUST: 80,
        MEDIUM_TRUST: 50,
        LOW_TRUST: 30,
        SUSPICIOUS: 20
    },

    // Wally Score Ranges
    WALLY_SCORE: {
        EXCELLENT: 90,
        VERY_GOOD: 80,
        GOOD: 70,
        FAIR: 60,
        POOR: 50
    },

    // Rate Limiting
    RATE_LIMITS: {
        GENERAL: {
            WINDOW_MS: 15 * 60 * 1000, // 15 minutes
            MAX_REQUESTS: 100
        },
        AUTH: {
            WINDOW_MS: 15 * 60 * 1000, // 15 minutes
            MAX_REQUESTS: 5
        },
        AI_SERVICES: {
            WINDOW_MS: 60 * 1000, // 1 minute
            MAX_REQUESTS: 10
        }
    },

    // Pagination
    PAGINATION: {
        DEFAULT_LIMIT: 20,
        MAX_LIMIT: 100,
        DEFAULT_PAGE: 1
    },

    // Azure Service Endpoints
    AZURE_SERVICES: {
        SPEECH: {
            BASE_URL: 'https://{region}.api.cognitive.microsoft.com/sts/v1.0',
            VERSION: 'v1.0'
        },
        LANGUAGE: {
            BASE_URL: 'https://{region}.api.cognitive.microsoft.com/text/analytics',
            VERSION: 'v3.1'
        },
        ML: {
            BASE_URL: 'https://{region}.ml.azure.com',
            VERSION: 'v1.0'
        }
    },

    // File Upload Limits
    FILE_UPLOAD: {
        MAX_SIZE: 10 * 1024 * 1024, // 10MB
        ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'audio/wav', 'audio/mp3'],
        MAX_FILES: 5
    },

    // Regular Expressions
    REGEX: {
        EMAIL: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        PHONE: /^[\+]?[1-9][\d]{0,15}$/,
        PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
        SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    },

    // Default Values
    DEFAULTS: {
        USER_PREFERENCES: {
            FAVORITE_CATEGORIES: [],
            BUDGET_RANGE: { min: 0, max: 10000 },
            BRANDS: [],
            NOTIFICATIONS: { email: true, push: true }
        },
        PRODUCT: {
            RATING: 0,
            REVIEW_COUNT: 0,
            POPULARITY: 0,
            STOCK: 0
        },
        REVIEW: {
            TRUST_SCORE: 50,
            HELPFUL_COUNT: 0,
            UNHELPFUL_COUNT: 0
        }
    }
};