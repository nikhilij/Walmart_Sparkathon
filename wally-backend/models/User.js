const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    dateOfBirth: {
        type: Date
    },
    preferences: {
        favoriteCategories: [{
            type: String,
            enum: ['electronics', 'clothing', 'sports', 'books', 'home', 'general']
        }],
        budgetRange: {
            min: {
                type: Number,
                default: 0,
                min: 0
            },
            max: {
                type: Number,
                default: 10000,
                min: 0
            }
        },
        brands: [String],
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            push: {
                type: Boolean,
                default: true
            }
        }
    },
    shoppingHistory: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        productName: String,
        category: String,
        price: Number,
        date: {
            type: Date,
            default: Date.now
        },
        wallyScore: Number
    }],
    lastLogin: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ 'preferences.favoriteCategories': 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
    return this.name;
});

// Method to get user's favorite categories
userSchema.methods.getFavoriteCategories = function() {
    return this.preferences.favoriteCategories || [];
};

// Method to check if user has preference for category
userSchema.methods.hasPreferenceForCategory = function(category) {
    return this.preferences.favoriteCategories && 
           this.preferences.favoriteCategories.includes(category);
};

// Pre-save middleware to update timestamps
userSchema.pre('save', function(next) {
    if (this.isModified() && !this.isNew) {
        this.updatedAt = new Date();
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;