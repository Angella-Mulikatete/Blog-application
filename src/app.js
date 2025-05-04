const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const rateLimit = require('express-rate-limit');

const app = express();

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS,
    max: process.env.RATE_LIMIT_MAX_REQUESTS
});

// Apply rate limiting to all routes
app.use('/api/', limiter);

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');
const commentRoutes = require('./routes/comments');
const searchRoutes = require('./routes/search');

app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/search', searchRoutes);

// Error handling middleware
app.use(require('./middleware/errorHandler'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});