// routes/todo.js
const express = require('express');
const { body } = require('express-validator');
const todoController = require('../controllers/todoController');

const router = express.Router();

// Add a new todo to a project
router.post(
    '/:projectId',
    [body('description').isString().notEmpty().withMessage('Description is required')],
    todoController.addTodo
);

// Update a todo
router.put(
    '/:todoId',
    [
        body('description').optional().isString().notEmpty().withMessage('Description must be a string'),
        body('status').optional().isIn(['Pending', 'Completed']).withMessage('Status must be Pending or Completed'),
    ],
    todoController.updateTodo
);

// Delete a todo
router.delete('/:todoId', todoController.deleteTodo);

module.exports = router;
