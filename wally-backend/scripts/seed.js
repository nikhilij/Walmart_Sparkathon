const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Review = require('../models/Review');

const users = [
    { username: 'john_doe', email: 'john@example.com', password: 'password123' },
    { username: 'jane_doe', email: 'jane@example.com', password: 'password456' },
];

const products = [
    { name: 'Product 1', description: 'Description for product 1', price: 29.99 },
    { name: 'Product 2', description: 'Description for product 2', price: 49.99 },
];

const reviews = [
    { productId: '1', userId: '1', content: 'Great product!', rating: 5 },
    { productId: '2', userId: '2', content: 'Not what I expected.', rating: 2 },
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        await User.deleteMany({});
        await Product.deleteMany({});
        await Review.deleteMany({});

        await User.insertMany(users);
        await Product.insertMany(products);
        await Review.insertMany(reviews);

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
}

seedDatabase();