const request = require('supertest');
const app = require('../server'); // Assuming server.js exports the Express app
const Product = require('../models/Product');

describe('Product API', () => {
    beforeEach(async () => {
        await Product.deleteMany({}); // Clear the database before each test
    });

    it('should create a new product', async () => {
        const productData = {
            name: 'Test Product',
            description: 'This is a test product.',
            price: 19.99,
            category: 'Test Category'
        };

        const response = await request(app)
            .post('/api/products') // Adjust the route as necessary
            .send(productData)
            .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toBe(productData.name);
    });

    it('should retrieve all products', async () => {
        await Product.create({
            name: 'Test Product 1',
            description: 'This is a test product 1.',
            price: 29.99,
            category: 'Test Category 1'
        });

        await Product.create({
            name: 'Test Product 2',
            description: 'This is a test product 2.',
            price: 39.99,
            category: 'Test Category 2'
        });

        const response = await request(app)
            .get('/api/products') // Adjust the route as necessary
            .expect(200);

        expect(response.body.length).toBe(2);
    });

    it('should return a product by ID', async () => {
        const product = await Product.create({
            name: 'Test Product',
            description: 'This is a test product.',
            price: 19.99,
            category: 'Test Category'
        });

        const response = await request(app)
            .get(`/api/products/${product._id}`) // Adjust the route as necessary
            .expect(200);

        expect(response.body.name).toBe(product.name);
    });

    it('should update a product', async () => {
        const product = await Product.create({
            name: 'Test Product',
            description: 'This is a test product.',
            price: 19.99,
            category: 'Test Category'
        });

        const updatedData = {
            name: 'Updated Product',
            price: 29.99
        };

        const response = await request(app)
            .put(`/api/products/${product._id}`) // Adjust the route as necessary
            .send(updatedData)
            .expect(200);

        expect(response.body.name).toBe(updatedData.name);
        expect(response.body.price).toBe(updatedData.price);
    });

    it('should delete a product', async () => {
        const product = await Product.create({
            name: 'Test Product',
            description: 'This is a test product.',
            price: 19.99,
            category: 'Test Category'
        });

        await request(app)
            .delete(`/api/products/${product._id}`) // Adjust the route as necessary
            .expect(204);

        const deletedProduct = await Product.findById(product._id);
        expect(deletedProduct).toBeNull();
    });
});