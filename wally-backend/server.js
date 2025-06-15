const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const appConfig = require('./config/app');
const { connectDB } = require('./config/db');
const chatRoutes = require('./routes/chat');
const productRoutes = require('./routes/products');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const healthRoutes = require('./routes/health');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(generalLimiter);

// Logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path} - ${req.ip}`);
    next();
});

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/health', healthRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Wally Backend API',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Handle 404s
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        await connectDB();
        
        const port = appConfig.port || process.env.PORT || 3000;
        app.listen(port, () => {
            logger.info(`Server running on port ${port}`);
            logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    mongoose.connection.close(() => {
        logger.info('MongoDB connection closed.');
        process.exit(0);
    });
});

startServer();