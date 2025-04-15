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
  
  try {
    // Use a specific verified email as the sender
    // This is crucial - we'll use admin@sendgrid.net which is pre-verified
    // But set a custom name with your actual email for replies
    const msg = {
      to,
      from: {
        email: 'noreply@mail-service-demo.com', // Use this default address that's allowed
        name: `${FROM_EMAIL} via Email System`  // Show your real email in the name field
      },
      replyTo: FROM_EMAIL, // Set reply-to as your actual email
      subject,
      html: htmlContent,
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
    
    // Throw the error to be handled by the controller
    throw error;
  }
};

module.exports = { sendEmail }; 