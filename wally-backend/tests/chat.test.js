const request = require('supertest');
const app = require('../server'); // Assuming server.js exports the Express app

describe('Chat API', () => {
    it('should respond with a 200 status for a valid chat request', async () => {
        const response = await request(app)
            .post('/api/chat') // Adjust the endpoint as necessary
            .send({ message: 'Hello, how can I help you?' });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('response');
    });

    it('should respond with a 400 status for an invalid chat request', async () => {
        const response = await request(app)
            .post('/api/chat')
            .send({}); // Sending an empty request
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it('should handle voice queries correctly', async () => {
        const response = await request(app)
            .post('/api/chat/voice') // Adjust the endpoint as necessary
            .send({ audio: 'base64EncodedAudioString' }); // Mock audio data
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('response');
    });
});