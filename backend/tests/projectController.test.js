const request = require('supertest');
const app = require('../server');
const Project = require('../models/Project');
const User = require('../models/User');

let authHeader;

beforeAll(async () => {
    const user = await User.create({ username: 'testuser', password: 'testpassword' });
    authHeader = 'Basic ' + Buffer.from(`${user.username}:testpassword`).toString('base64');
});

afterAll(async () => {
    await User.deleteMany();
    await Project.deleteMany();
});

describe('Project Controller', () => {
    it('should create a project', async () => {
        const res = await request(app)
            .post('/api/projects')
            .set('Authorization', authHeader)
            .send({ title: 'Test Project' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('title', 'Test Project');
    });

    it('should retrieve all projects', async () => {
        await Project.create({ title: 'Test Project', user: (await User.findOne())._id });

        const res = await request(app)
            .get('/api/projects')
            .set('Authorization', authHeader);

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should update a project', async () => {
        const project = await Project.create({ title: 'Old Title', user: (await User.findOne())._id });

        const res = await request(app)
            .put(`/api/projects/${project._id}`)
            .set('Authorization', authHeader)
            .send({ title: 'Updated Title' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('title', 'Updated Title');
    });

    it('should delete a project', async () => {
        const project = await Project.create({ title: 'Delete Me', user: (await User.findOne())._id });

        const res = await request(app)
            .delete(`/api/projects/${project._id}`)
            .set('Authorization', authHeader);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Project deleted successfully');
    });
});
