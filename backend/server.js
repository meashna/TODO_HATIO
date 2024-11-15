// server.js
require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const todoRoutes = require('./routes/todo');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Configure CORS
app.use(cors({
    origin: 'http://localhost:5178', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/todos', todoRoutes);

// Connect to MongoDB and Start Server
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

module.exports = app; // Exporting for testing purposes












// // server.js
// require('dotenv').config(); // Load environment variables from .env

// const express = require('express');
// const mongoose = require('mongoose');
// const authRoutes = require('./routes/auth');
// const projectRoutes = require('./routes/projects');
// const todoRoutes = require('./routes/todo');

// const app = express();

// // Middleware to parse JSON
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/projects', projectRoutes);
// app.use('/api/todos', todoRoutes);

// // Connect to MongoDB and Start Server
// mongoose
//     .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log('Connected to MongoDB');
//         const PORT = process.env.PORT || 3000;
//         app.listen(PORT, () => {
//             console.log(`Server running on port ${PORT}`);
//         });
//     })
//     .catch((err) => {
//         console.error('MongoDB connection error:', err);
//     });

// module.exports = app; // Exporting for testing purposes
