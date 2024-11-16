// const request = require('supertest');
// const { MongoMemoryServer } = require('mongodb-memory-server');
// const mongoose = require('mongoose');
// const app = require('../server');
// const User = require('../models/User');

// let mongoServer;

// beforeAll(async () => {
//     mongoServer = await MongoMemoryServer.create();
//     await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
// });

// afterAll(async () => {
//     await mongoose.disconnect();
//     await mongoServer.stop();
// });

const request = require('supertest');
const app = require('../server');
const User = require('../models/User');



describe('Auth Controller', () => {
    it('should register a user successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: 'testuser', password: 'testpassword' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('authorization');
    });

    it('should fail registration with a duplicate username', async () => {
        await User.create({ username: 'testuser', password: 'testpassword' });

        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: 'testuser', password: 'anotherpassword' });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Username already exists');
    });

    it('should log in successfully', async () => {
        await User.create({ username: 'testuser', password: 'testpassword' });

        const res = await request(app)
            .post('/api/auth/login')
            .set('Authorization', 'Basic ' + Buffer.from('testuser:testpassword').toString('base64'));

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Logged in successfully');
    });

    it('should fail login with invalid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .set('Authorization', 'Basic ' + Buffer.from('invaliduser:invalidpass').toString('base64'));

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('User not found');
    });

    it('should fail login with malformed authorization header', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .set('Authorization', 'Basic malformedheader');

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Authorization header missing or malformed');
    });
});
