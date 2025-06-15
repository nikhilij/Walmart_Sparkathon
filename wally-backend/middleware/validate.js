const Joi = require('joi');

/**
 * Validation middleware using Joi
 */

const validateChatInput = (req, res, next) => {
    const schema = Joi.object({
        query: Joi.string().min(1).max(500).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ 
            success: false,
            message: 'Validation error',
            details: error.details[0].message 
        });
    }
    next();
};

const validateProductSearch = (req, res, next) => {
    const schema = Joi.object({
        query: Joi.string().min(1).max(200).optional(),
        category: Joi.string().max(50).optional(),
        minPrice: Joi.number().min(0).optional(),
        maxPrice: Joi.number().min(0).optional(),
        limit: Joi.number().min(1).max(100).optional()
    });

    const { error } = schema.validate(req.query);
    if (error) {
        return res.status(400).json({ 
            success: false,
            message: 'Validation error',
            details: error.details[0].message 
        });
    }
    next();
};

const validateReview = (req, res, next) => {
    const schema = Joi.object({
        productId: Joi.string().required(),
        text: Joi.string().min(10).max(2000).required(),
        rating: Joi.number().min(1).max(5).required(),
        title: Joi.string().max(200).optional(),
        verifiedPurchase: Joi.boolean().optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ 
            success: false,
            message: 'Validation error',
            details: error.details[0].message 
        });
    }
    next();
};

const validateUserRegistration = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(100).required(),
        name: Joi.string().min(1).max(100).required(),
        preferences: Joi.object({
            favoriteCategories: Joi.array().items(Joi.string()).optional(),
            budgetRange: Joi.object({
                min: Joi.number().min(0).optional(),
                max: Joi.number().min(0).optional()
            }).optional(),
            brands: Joi.array().items(Joi.string()).optional()
        }).optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ 
            success: false,
            message: 'Validation error',
            details: error.details[0].message 
        });
    }
    next();
};

const validateUserLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ 
            success: false,
            message: 'Validation error',
            details: error.details[0].message 
        });
    }
    next();
};

const validateProductRecommendation = (req, res, next) => {
    const schema = Joi.object({
        category: Joi.string().max(50).optional(),
        budget: Joi.object({
            min: Joi.number().min(0).optional(),
            max: Joi.number().min(0).optional()
        }).optional(),
        preferences: Joi.array().items(Joi.string()).optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ 
            success: false,
            message: 'Validation error',
            details: error.details[0].message 
        });
    }
    next();
};

const validateProductComparison = (req, res, next) => {
    const schema = Joi.object({
        productIds: Joi.array().items(Joi.string()).min(2).max(5).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ 
            success: false,
            message: 'Validation error',
            details: error.details[0].message 
        });
    }
    next();
};

module.exports = {
    validateChatInput,
    validateProductSearch,
    validateReview,
    validateUserRegistration,
    validateUserLogin,
    validateProductRecommendation,
    validateProductComparison
};