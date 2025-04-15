const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const emailRoutes = require('./backend/routes/emailRoutes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Debug middleware for email routes
app.use('/api/emails', (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request Headers:', JSON.stringify(req.headers));
  if (req.body) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.content) {
      sanitizedBody.content = sanitizedBody.content.substring(0, 100) + '... (truncated)';
    }
    console.log('Request Body:', JSON.stringify(sanitizedBody));
  }
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Fix for Gmail API in Windows
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Use routes
app.use('/api/emails', emailRoutes);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Global error handler caught:', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Send a consistent error response
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Email routes available at: http://localhost:' + PORT + '/api/emails');
}); 