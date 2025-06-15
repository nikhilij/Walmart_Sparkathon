const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewerId: {
        type: String, // For anonymous reviews or external reviewer IDs
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
        index: true
    },
    title: {
        type: String,
        trim: true,
        maxlength: 200
    },
    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 2000
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    verifiedPurchase: {
        type: Boolean,
        default: false
    },
    helpfulCount: {
        type: Number,
        default: 0,
        min: 0
    },
    unhelpfulCount: {
        type: Number,
        default: 0,
        min: 0
    },
    images: [{
        url: String,
        caption: String
    }],
    pros: [String],
    cons: [String],
    sentiment: {
        score: {
            type: Number,
            min: -1,
            max: 1
        },
        label: {
            type: String,
            enum: ['positive', 'negative', 'neutral']
        },
        confidence: {
            type: Number,
            min: 0,
            max: 1
        }
    },
    trustScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
    },
    flags: [{
        type: String,
        enum: [
            'too-short',
            'too-long',
            'sentiment-rating-mismatch',
            'suspicious-pattern',
            'prolific-reviewer',
            'unverified-purchase',
            'analysis-error'
        ]
    }],
    moderationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'flagged'],
        default: 'pending'
    },
    isRecommended: {
        type: Boolean
    },
    reviewerName: {
        type: String,
        trim: true,
        maxlength: 100
    },
    reviewerLocation: {
        type: String,
        trim: true
    },
    purchaseDate: {
        type: Date
    },
    reviewDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for better performance
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ reviewerId: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ trustScore: -1 });
reviewSchema.index({ helpfulCount: -1 });
reviewSchema.index({ verifiedPurchase: 1 });

// Virtual for helpfulness ratio
reviewSchema.virtual('helpfulnessRatio').get(function() {
    const total = this.helpfulCount + this.unhelpfulCount;
    return total > 0 ? this.helpfulCount / total : 0;
});

// Method to check if review is helpful
reviewSchema.methods.isHelpful = function() {
    return this.helpfulCount > this.unhelpfulCount;
};

// Method to check if review is flagged as suspicious
reviewSchema.methods.isSuspicious = function() {
    return this.trustScore < 50 || this.flags.length > 0;
};

// Method to get review quality score
reviewSchema.methods.getQualityScore = function() {
    let score = 50; // Base score
    
    // Adjust based on length
    if (this.text.length > 100) score += 10;
    if (this.text.length > 300) score += 10;
    
    // Adjust based on verification
    if (this.verifiedPurchase) score += 20;
    
    // Adjust based on helpfulness
    if (this.helpfulCount > 0) score += Math.min(this.helpfulCount * 2, 20);
    
    // Adjust based on trust score
    score = (score + this.trustScore) / 2;
    
    return Math.min(100, Math.max(0, score));
};

// Pre-save middleware
reviewSchema.pre('save', function(next) {
    // Set reviewDate if not provided
    if (!this.reviewDate) {
        this.reviewDate = new Date();
    }
    
    // Auto-determine recommendation based on rating
    if (this.isRecommended === undefined) {
        this.isRecommended = this.rating >= 4;
    }
    
    next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;