require('dotenv').config();

const config = {
    // Server Configuration
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    host: process.env.HOST || 'localhost',
    
    // Client Configuration
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    
    // Database Configuration
    database: {
        uri: process.env.DATABASE_URL || process.env.MONGO_URI || 'mongodb://localhost:27017/wally',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        }
    },
    
    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'your-fallback-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    },
    
    // Azure Services Configuration
    azure: {
        // Speech Service
        speech: {
            key: process.env.AZURE_SPEECH_KEY || process.env.AZURE_COGNITIVE_SERVICE_KEY,
            region: process.env.AZURE_SPEECH_REGION || process.env.AZURE_COGNITIVE_SERVICE_REGION || 'eastus',
            endpoint: process.env.AZURE_SPEECH_ENDPOINT
        },
        
        // Language Service
        language: {
            key: process.env.AZURE_LANGUAGE_KEY || process.env.AZURE_COGNITIVE_SERVICE_KEY,
            endpoint: process.env.AZURE_LANGUAGE_ENDPOINT,
            region: process.env.AZURE_LANGUAGE_REGION || process.env.AZURE_COGNITIVE_SERVICE_REGION || 'eastus'
        },
        
        // Machine Learning Service
        ml: {
            endpoint: process.env.AZURE_ML_ENDPOINT,
            key: process.env.AZURE_ML_KEY,
            deploymentName: process.env.AZURE_ML_DEPLOYMENT_NAME || 'wally-recommender'
        }
    },
    
    // Rate Limiting Configuration
    rateLimiting: {
        enabled: process.env.RATE_LIMITING_ENABLED !== 'false',
        general: {
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
            max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
        },
        auth: {
            windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
            max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 5
        }
    },
    
    // Logging Configuration
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        file: {
            enabled: process.env.LOG_TO_FILE !== 'false',
            errorFile: process.env.LOG_ERROR_FILE || 'logs/error.log',
            combinedFile: process.env.LOG_COMBINED_FILE || 'logs/combined.log'
        },
        console: {
            enabled: process.env.LOG_TO_CONSOLE !== 'false'
        }
    },
    
    // File Upload Configuration
    upload: {
        maxSize: parseInt(process.env.UPLOAD_MAX_SIZE) || 10 * 1024 * 1024, // 10MB
        allowedTypes: (process.env.UPLOAD_ALLOWED_TYPES || 'image/jpeg,image/png,audio/wav').split(','),
        destination: process.env.UPLOAD_DESTINATION || 'uploads/'
    },
    
    // CORS Configuration
    cors: {
        origin: process.env.CORS_ORIGIN || process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: process.env.CORS_CREDENTIALS !== 'false'
    },
    
    // Pagination Configuration
    pagination: {
        defaultLimit: parseInt(process.env.PAGINATION_DEFAULT_LIMIT) || 20,
        maxLimit: parseInt(process.env.PAGINATION_MAX_LIMIT) || 100
    },
    
    // Feature Flags
    features: {
        voiceInput: process.env.FEATURE_VOICE_INPUT !== 'false',
        mlRecommendations: process.env.FEATURE_ML_RECOMMENDATIONS !== 'false',
        reviewSummarization: process.env.FEATURE_REVIEW_SUMMARIZATION !== 'false',
        fakeReviewDetection: process.env.FEATURE_FAKE_REVIEW_DETECTION !== 'false',
        wallyScore: process.env.FEATURE_WALLY_SCORE !== 'false'
    },
    
    // Development/Debug Configuration
    debug: {
        enabled: process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development',
        logRequests: process.env.DEBUG_LOG_REQUESTS === 'true',
        logResponses: process.env.DEBUG_LOG_RESPONSES === 'true'
    }
};

// Validation function to check required environment variables
config.validate = function() {
    const required = [];
    
    if (!this.database.uri.includes('mongodb')) {
        required.push('DATABASE_URL or MONGO_URI');
    }
    
    if (!this.jwt.secret || this.jwt.secret === 'your-fallback-secret-key') {
        console.warn('Warning: Using default JWT secret. Set JWT_SECRET environment variable for production.');
    }
    
    if (this.features.voiceInput && !this.azure.speech.key) {
        required.push('AZURE_SPEECH_KEY for voice input feature');
    }
    
    if (this.features.reviewSummarization && !this.azure.language.key) {
        required.push('AZURE_LANGUAGE_KEY for review summarization feature');
    }
    
    if (required.length > 0 && this.env === 'production') {
        throw new Error(`Missing required environment variables: ${required.join(', ')}`);
    }
    
    return true;
};

module.exports = config;