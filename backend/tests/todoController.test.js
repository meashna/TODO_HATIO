const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Project = require('../models/Project');
const Todo = require('../models/Todo');

let mongoServer;
let authHeader;
let projectId;

beforeAll(async () => {
    // Set up in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });

    // Create a user and authenticate
    const user = await User.create({ username: 'testuser', password: 'testpassword' });
    authHeader = 'Basic ' + Buffer.from(`${user.username}:testpassword`).toString('base64');

    // Create a project for the user
    const project = await Project.create({ title: 'Test Project', user: user._id });
    projectId = project._id;
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await Todo.deleteMany();
});

describe('Todo Controller', () => {
    it('should add a new todo to a project', async () => {
        const res = await request(app)
            .post(`/api/todos/${projectId}`)
            .set('Authorization', authHeader)
            .send({ description: 'New Todo Item' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('description', 'New Todo Item');
    });

    it('should fail to add a todo to a non-existent project', async () => {
        const res = await request(app)
            .post(`/api/todos/invalidProjectId`)
            .set('Authorization', authHeader)
            .send({ description: 'Todo for non-existent project' });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Project not found');
    });

    it('should update a todo', async () => {
        // Create a todo
        const todo = await Todo.create({ description: 'Old Todo', status: 'Pending' });
        const project = await Project.findById(projectId);
        project.todos.push(todo._id);
        await project.save();

        // Update the todo
        const res = await request(app)
            .put(`/api/todos/${todo._id}`)
            .set('Authorization', authHeader)
            .send({ description: 'Updated Todo', status: 'Completed' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('description', 'Updated Todo');
        expect(res.body).toHaveProperty('status', 'Completed');
        expect(res.body).toHaveProperty('completedDate');
    });

    it('should fail to update a non-existent todo', async () => {
        const res = await request(app)
            .put('/api/todos/invalidTodoId')
            .set('Authorization', authHeader)
            .send({ description: 'Updated Todo', status: 'Completed' });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Todo not found');
    });

    it('should delete a todo', async () => {
        // Create a todo
        const todo = await Todo.create({ description: 'Todo to Delete' });
        const project = await Project.findById(projectId);
        project.todos.push(todo._id);
        await project.save();

        // Delete the todo
        const res = await request(app)
            .delete(`/api/todos/${todo._id}`)
            .set('Authorization', authHeader);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Todo deleted successfully');

        // Verify deletion
        const deletedTodo = await Todo.findById(todo._id);
        expect(deletedTodo).toBeNull();
    });

    it('should fail to delete a non-existent todo', async () => {
        const res = await request(app)
            .delete('/api/todos/invalidTodoId')
            .set('Authorization', authHeader);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Todo not found');
    });

    it('should fail to add a todo without authorization', async () => {
        const res = await request(app)
            .post(`/api/todos/${projectId}`)
            .send({ description: 'Unauthorized Todo' });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Unauthorized');
    });
});
