const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome root path
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Admin API.',
    version: '1.0.0'
  });
});

// Mount all api routes
app.use('/api', apiRouter);

// Handle 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
