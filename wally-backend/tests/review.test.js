const request = require('supertest');
const app = require('../server'); // Assuming server.js exports the Express app
const Review = require('../models/Review');

describe('Review API', () => {
    beforeEach(async () => {
        await Review.deleteMany({});
    });

    it('should create a new review', async () => {
        const reviewData = {
            productId: '12345',
            userId: '67890',
            rating: 5,
            comment: 'Excellent product!',
        };

        const response = await request(app)
            .post('/api/reviews')
            .send(reviewData)
            .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body.productId).toBe(reviewData.productId);
        expect(response.body.userId).toBe(reviewData.userId);
        expect(response.body.rating).toBe(reviewData.rating);
        expect(response.body.comment).toBe(reviewData.comment);
    });

    it('should return all reviews for a product', async () => {
        const reviewData = {
            productId: '12345',
            userId: '67890',
            rating: 5,
            comment: 'Excellent product!',
        };

        await new Review(reviewData).save();

        const response = await request(app)
            .get('/api/reviews?productId=12345')
            .expect(200);

        expect(response.body.length).toBe(1);
        expect(response.body[0].comment).toBe(reviewData.comment);
    });

    it('should return a 404 for a non-existent review', async () => {
        const response = await request(app)
            .get('/api/reviews/invalidId')
            .expect(404);

        expect(response.body.message).toBe('Review not found');
    });

    it('should delete a review', async () => {
        const review = await new Review({
            productId: '12345',
            userId: '67890',
            rating: 5,
            comment: 'Excellent product!',
        }).save();

        const response = await request(app)
            .delete(`/api/reviews/${review._id}`)
            .expect(200);

        expect(response.body.message).toBe('Review deleted successfully');
    });
});