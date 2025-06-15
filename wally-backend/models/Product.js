const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        trim: true,
        enum: ['electronics', 'clothing', 'sports', 'books', 'home', 'general'],
        index: true
    },
    subcategory: {
        type: String,
        trim: true
    },
    brand: {
        type: String,
        trim: true,
        maxlength: 100
    },
    model: {
        type: String,
        trim: true,
        maxlength: 100
    },
    images: [{
        url: String,
        alt: String,
        isPrimary: {
            type: Boolean,
            default: false
        }
    }],
    features: [{
        name: String,
        value: String
    }],
    specifications: {
        type: Map,
        of: String
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    popularity: {
        type: Number,
        default: 0,
        index: true
    },
    tags: [String],
    dimensions: {
        length: Number,
        width: Number,
        height: Number,
        weight: Number,
        unit: {
            type: String,
            enum: ['cm', 'inch', 'kg', 'lb'],
            default: 'cm'
        }
    },
    availability: {
        inStock: {
            type: Boolean,
            default: true
        },
        stockQuantity: {
            type: Number,
            default: 0
        },
        restockDate: Date
    },
    seo: {
        metaTitle: String,
        metaDescription: String,
        slug: {
            type: String,
            unique: true,
            sparse: true
        }
    },
    pricing: {
        originalPrice: Number,
        discountPercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        finalPrice: Number
    },
    vendor: {
        name: String,
        id: String,
        rating: Number
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ rating: -1, reviewCount: -1 });
productSchema.index({ popularity: -1 });
productSchema.index({ 'pricing.finalPrice': 1 });
productSchema.index({ createdAt: -1 });

// Virtual for average rating
productSchema.virtual('averageRating').get(function() {
    return this.rating || 0;
});

// Virtual for final price calculation
productSchema.virtual('finalPrice').get(function() {
    if (this.pricing && this.pricing.originalPrice && this.pricing.discountPercentage) {
        return this.pricing.originalPrice * (1 - this.pricing.discountPercentage / 100);
    }
    return this.price;
});

// Method to check if product is in stock
productSchema.methods.isInStock = function() {
    return this.availability.inStock && this.availability.stockQuantity > 0;
};

// Method to get discount amount
productSchema.methods.getDiscountAmount = function() {
    if (this.pricing && this.pricing.originalPrice && this.pricing.discountPercentage) {
        return this.pricing.originalPrice * (this.pricing.discountPercentage / 100);
    }
    return 0;
};

// Pre-save middleware to calculate final price
productSchema.pre('save', function(next) {
    if (this.pricing && this.pricing.originalPrice && this.pricing.discountPercentage) {
        this.pricing.finalPrice = this.pricing.originalPrice * (1 - this.pricing.discountPercentage / 100);
    } else {
        this.pricing = this.pricing || {};
        this.pricing.finalPrice = this.price;
    }
    
    // Generate slug if not provided
    if (!this.seo.slug && this.name) {
        this.seo = this.seo || {};
        this.seo.slug = this.name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;