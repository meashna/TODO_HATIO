// controllers/authController.js
const { validationResult } = require('express-validator');
const User = require('../models/User');

/**
 * Helper function to parse Basic Auth credentials
 */
const parseBasicAuth = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return null;
    }
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    return { username, password };
};



// Register a new user
exports.register = async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { username, password } = req.body;

        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create a new user
        const user = new User({ username, password });
        await user.save();

        // Generate Basic Auth token
        const base64Token = Buffer.from(`${username}:${password}`).toString('base64');
        const authHeader = `Basic ${base64Token}`;

        // Log the generated Authorization header
        console.log(`Generated Authorization Header: ${authHeader}`);

        // Respond with the Authorization header
        res.status(201).json({
            message: 'User registered successfully',
            authorization: authHeader, // Include Authorization header in response
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Login an existing user using Basic Auth
exports.login = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const credentials = parseBasicAuth(authHeader);

        if (!credentials) {
            return res.status(400).json({ message: 'Authorization header missing or malformed' });
        }

        const { username, password } = credentials;

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        res.status(200).json({ message: 'Logged in successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
