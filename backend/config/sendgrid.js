const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');

dotenv.config();

// Set SendGrid API key from environment variables
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL;

console.log('SendGrid Configuration:');
console.log('- API Key exists:', !!SENDGRID_API_KEY);
console.log('- FROM_EMAIL:', FROM_EMAIL || 'Not configured');

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
  console.log('SendGrid API configured successfully');
} else {
  console.warn('SendGrid API key not found. Email sending will be simulated.');
}

// Send email function using SendGrid
const sendEmail = async (to, subject, htmlContent, from = FROM_EMAIL || 'noreply@example.com') => {
  console.log(`\n==== EMAIL SEND REQUEST ====`);
  console.log(`From: ${from}`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content length: ${htmlContent.length} characters`);
  
  // Check if sender is verified
  if (!SENDGRID_API_KEY) {
    console.log('❌ NO API KEY: Email sending simulated');
    return {
      success: true,
      messageId: `simulated_${Date.now()}`,
      simulated: true
    };
  }
  
  // Check if sender email is set
  if (!from || from === 'noreply@example.com' || from === 'your_verified_sender@example.com') {
    const error = new Error('FROM_EMAIL is not properly configured. Check your .env file.');
    console.error('❌ ERROR:', error.message);
    throw error;
  }
  
  try {
    // Prepare email message
    const msg = {
      to,
      from: {
        email: from,
        name: 'Email System' // Adding a sender name helps deliverability
      },
      subject,
      html: htmlContent,
      mail_settings: {
        sandbox_mode: {
          enable: process.env.NODE_ENV !== 'production'
        }
      }
    };
    
    console.log('Sending email with SendGrid...');
    
    // Send email with SendGrid
    const response = await sgMail.send(msg);
    
    console.log('✅ SUCCESS: Email sent via SendGrid');
    console.log('Status code:', response[0]?.statusCode);
    console.log('Headers:', JSON.stringify(response[0]?.headers || {}));
    
    return {
      success: true,
      messageId: response[0]?.headers['x-message-id'] || `sendgrid_${Date.now()}`,
      statusCode: response[0]?.statusCode
    };
  } catch (error) {
    console.error('❌ ERROR: Failed to send email with SendGrid');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error body:', JSON.stringify(error.response.body));
      console.error('Error headers:', JSON.stringify(error.response.headers));
    }
    
    // Check for common issues
    if (error.message && error.message.includes('sender identity')) {
      error.specificCause = 'The sender email is not verified in SendGrid. Verify your email address in the SendGrid dashboard.';
      console.error('POSSIBLE CAUSE:', error.specificCause);
    }
    
    if (error.code === 403) {
      error.specificCause = 'API key doesn\'t have permission to send mail. Make sure your API key has "Mail Send" permissions.';
      console.error('POSSIBLE CAUSE:', error.specificCause);
    }
    
    // Always throw the error for debugging
    throw error;
  }
};

module.exports = { sendEmail }; 