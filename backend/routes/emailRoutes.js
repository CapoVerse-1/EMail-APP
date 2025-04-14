const express = require('express');
const { generateEmail, sendEmail } = require('../controllers/emailController');
const router = express.Router();

// Generate email route
router.post('/generate', generateEmail);

// Send email route
router.post('/send', sendEmail);

module.exports = router; 