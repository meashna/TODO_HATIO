// routes/auth.js
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

// Register Route
router.post(
    '/register',
    [
        body('username').isString().notEmpty().withMessage('Username is required'),
        body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    authController.register
);

// Login Route (using Basic Auth)
router.post('/login', authController.login);

module.exports = router;
