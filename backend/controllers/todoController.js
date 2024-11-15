// controllers/todoController.js
const Todo = require('../models/Todo');
const Project = require('../models/Project');
const User = require('../models/User');

/**
 * Helper function to authenticate user using Basic Auth
 */
const authenticate = async (req) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return null;
    }
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    const user = await User.findOne({ username });
    if (!user) return null;

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return null;

    return user;
};

// Add a new todo to a project
exports.addTodo = async (req, res) => {
    try {
        const user = await authenticate(req);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { description } = req.body;
        const projectId = req.params.projectId;

        // Find the project
        const project = await Project.findOne({ _id: projectId, user: user._id });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Create a new todo
        const todo = new Todo({ description });
        await todo.save();

        // Add todo to the project's todos list
        project.todos.push(todo._id);
        await project.save();

        res.status(201).json(todo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a todo
exports.updateTodo = async (req, res) => {
    try {
        const user = await authenticate(req);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { description, status } = req.body;
        const todoId = req.params.todoId;

        // Find the project that contains this todo and belongs to the user
        const project = await Project.findOne({ user: user._id, todos: todoId });
        if (!project) return res.status(404).json({ message: 'Todo not found in your projects' });

        // Update the todo
        const updatedTodo = await Todo.findByIdAndUpdate(
            todoId,
            { description, status, updatedDate: Date.now() },
            { new: true }
        );

        if (!updatedTodo) return res.status(404).json({ message: 'Todo not found' });

        res.status(200).json(updatedTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
    try {
        const user = await authenticate(req);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const todoId = req.params.todoId;

        // Find the project that contains this todo and belongs to the user
        const project = await Project.findOne({ user: user._id, todos: todoId });
        if (!project) return res.status(404).json({ message: 'Todo not found in your projects' });

        // Remove the todo from the project's todos array
        project.todos = project.todos.filter(id => id.toString() !== todoId);
        await project.save();

        // Delete the todo
        const deletedTodo = await Todo.findByIdAndDelete(todoId);
        if (!deletedTodo) return res.status(404).json({ message: 'Todo not found' });

        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
