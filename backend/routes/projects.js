// routes/projects.js
const express = require('express');
const { body } = require('express-validator');
const projectController = require('../controllers/projectController');

const router = express.Router();

// Create a new project
router.post(
    '/',
    [body('title').isString().notEmpty().withMessage('Title is required')],
    projectController.createProject
);

// Get all projects
router.get('/', projectController.getAllProjects);

// Get a specific project by ID
router.get('/:id', projectController.getProjectById);

// Update project title
router.put(
    '/:id',
    [body('title').isString().notEmpty().withMessage('Title is required')],
    projectController.updateProjectTitle
);

// Delete a project
router.delete('/:id', projectController.deleteProject);

// Export project summary as a Gist
router.post('/:id/export', projectController.exportProjectSummary);

module.exports = router;
