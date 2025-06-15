const mongoose = require('mongoose');
const appConfig = require('./app');
const logger = require('../utils/logger');

/**
 * Database Configuration and Connection
 */

const dbConfig = {
    mongoURI: appConfig.database.uri,
    options: appConfig.database.options
};

const connectDB = async () => {
    try {
        // Validate app configuration
        appConfig.validate();
        
        const conn = await mongoose.connect(dbConfig.mongoURI, dbConfig.options);
        
        logger.info(`MongoDB connected successfully: ${conn.connection.host}`);
        logger.info(`Database: ${conn.connection.name}`);
        
        // Connection events
        mongoose.connection.on('error', (error) => {
            logger.error('MongoDB connection error:', error);
        });
        
        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });
        
        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });
        
        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            logger.info('MongoDB connection closed through app termination');
            process.exit(0);
        });
        
        return conn;
    } catch (error) {
        logger.error('MongoDB connection error:', error.message);
        
        if (appConfig.env === 'development') {
            logger.error('Full error details:', error);
        }
        
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed');
    } catch (error) {
        logger.error('Error closing MongoDB connection:', error);
    }
};

module.exports = {
    connectDB,
    disconnectDB,
    mongoURI: dbConfig.mongoURI,
    options: dbConfig.options
};quire('mongoose');
const config = require('config');

const dbURI = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;