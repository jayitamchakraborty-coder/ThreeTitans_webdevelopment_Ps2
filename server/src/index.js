const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from server root .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('./config/db');

// Import Route Handlers
const authRoutes = require('./routes/auth.routes');
const postsRoutes = require('./routes/posts.routes');
const moderationRoutes = require('./routes/moderation.routes');
const usersRoutes = require('./routes/users.routes');
const aiRoutes = require('./routes/ai.routes');
const notificationsRoutes = require('./routes/notifications.routes');

// Connect to Database
connectDB();

const app = express();

// Standard Middlewares
app.use(cors({
  origin: '*', // Permissive for local hackathon testing across ports
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-demo-role']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Development Request Logger
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown';
  res.status(200).json({
    status: 'ok',
    service: 'LocalLoop API Server',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/moderation', moderationRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationsRoutes);

// Optionally serve client static files if accessed directly
const clientPath = path.join(__dirname, '../../client');
app.use('/client', express.static(clientPath));

// 404 Route Catch-All
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found on LocalLoop server`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack || err.message);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 LocalLoop Server running on port ${PORT}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api`);
  console.log(`🩺 Health:   http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});

module.exports = app;
