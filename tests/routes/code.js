//Nikunj Shetye //lab1-Unit test

const request = require('supertest');
const app = require('../../server');

describe('POST /api/auth/login', () => {
    
    it('should login with valid credentials', async () => {
        // Create test user first
        await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Test User',
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });

        // Test login
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                emailOrUsername: 'test@example.com',
                password: 'password123'
            })
            .expect(200);
        
        expect(response.body.success).toBe(true);
    });

    it('should return error for invalid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                emailOrUsername: 'wrong@email.com',
                password: 'wrongpass'
            })
            .expect(404);
        
        expect(response.body.error).toBe('Invalid credentials');
    });

    it('should return error when fields are missing', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                emailOrUsername: 'test@example.com'
                // missing password
            })
            .expect(400);
        
        expect(response.body.error).toBe('All input is required');
    });

    // test with username instead of email
    it('should login using username', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                emailOrUsername: 'testuser',
                password: 'password123'
            })
            .expect(200);
        
        expect(response.body.success).toBe(true);
    });

    // test wrong password
    it('should fail with wrong password', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                emailOrUsername: 'test@example.com',
                password: 'wrongpassword'
            })
            .expect(404);
        
        expect(response.body.error).toBe('Invalid credentials');
    });

    // test empty password
    it('should fail when password is empty', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                emailOrUsername: 'test@example.com',
                password: ''
            })
            .expect(400);
        
        expect(response.body.error).toBe('All input is required');
    });

    // test when both fields empty
    it('should fail when no data sent', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({})
            .expect(400);
        
        expect(response.body.error).toBe('All input is required');
    });

});