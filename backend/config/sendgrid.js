const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');

dotenv.config();

// Set SendGrid API key from environment variables
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
  console.log('SendGrid API configured successfully');
} else {
  console.warn('SendGrid API key not found. Email sending will be simulated.');
}

// Send email function using SendGrid
const sendEmail = async (to, subject, htmlContent, from = process.env.FROM_EMAIL || 'noreply@example.com') => {
  // If no API key, simulate email sending
  if (!SENDGRID_API_KEY) {
    console.log('=== SIMULATING EMAIL SEND ===');
    console.log(`From: ${from}`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content length: ${htmlContent.length} characters`);
    console.log('============================');
    
    // Return simulated response
    return {
      success: true,
      messageId: `simulated_${Date.now()}`,
      simulated: true
    };
  }
  
  try {
    // Prepare email message
    const msg = {
      to,
      from,
      subject,
      html: htmlContent,
    };
    
    // Send email with SendGrid
    const response = await sgMail.send(msg);
    
    console.log('Email sent successfully via SendGrid');
    return {
      success: true,
      messageId: response[0]?.headers['x-message-id'] || `sendgrid_${Date.now()}`,
      statusCode: response[0]?.statusCode
    };
  } catch (error) {
    console.error('Error sending email with SendGrid:', error);
    
    // For development - simulate success if API fails
    if (process.env.NODE_ENV !== 'production') {
      console.log('Development mode: Simulating successful send despite error');
      return {
        success: true,
        messageId: `error_fallback_${Date.now()}`,
        simulated: true,
        error: error.message
      };
    }
    
    throw error;
  }
};

module.exports = { sendEmail }; 