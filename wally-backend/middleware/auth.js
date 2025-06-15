const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');

const verifyToken = promisify(jwt.verify);

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Access token required' 
            });
        }

        const decoded = await verifyToken(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token - user not found' 
            });
        }

        req.user = {
            userId: user._id,
            email: user.email,
            name: user.name
        };
        
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false,
            message: 'Invalid or expired token' 
        });
    }
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];

        if (token) {
            const decoded = await verifyToken(token, process.env.JWT_SECRET || 'your-secret-key');
            const user = await User.findById(decoded.userId);

            if (user) {
                req.user = {
                    userId: user._id,
                    email: user.email,
                    name: user.name
                };
            }
        }
        
        next();
    } catch (error) {
        // Ignore token errors for optional auth
        next();
    }
};

module.exports = {
    authenticate,
    optionalAuth
};