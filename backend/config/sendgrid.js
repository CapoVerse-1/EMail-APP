const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();

// Set SendGrid API key from environment variables
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL;

console.log('SendGrid Configuration:');
console.log('- API Key exists:', !!SENDGRID_API_KEY);
console.log('- FROM_EMAIL:', FROM_EMAIL || 'Not configured');

// Send email function using direct API calls instead of SDK
const sendEmail = async (to, subject, htmlContent, from = FROM_EMAIL || 'noreply@example.com') => {
  console.log(`\n==== EMAIL SEND REQUEST ====`);
  console.log(`From: ${from}`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content length: ${htmlContent.length} characters`);
  
  // Simulate success if no API key
  if (!SENDGRID_API_KEY) {
    console.log('❌ NO API KEY: Email sending simulated');
    return {
      success: true,
      messageId: `simulated_${Date.now()}`,
      simulated: true
    };
  }
  
  try {
    console.log('Sending email directly via SendGrid API...');
    
    // Create the email request payload
    const payload = {
      personalizations: [{
        to: [{ email: to }],
        subject: subject,
      }],
      from: { email: from },
      content: [{
        type: 'text/html',
        value: htmlContent
      }],
      mail_settings: {
        sandbox_mode: {
          enable: true
        }
      }
    };
    
    console.log('Request payload:', JSON.stringify(payload, null, 2));
    
    // Send the API request directly
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    // Check the response
    if (response.ok) {
      console.log('✅ SUCCESS: Email sent via SendGrid API');
      console.log('Status:', response.status);
      
      // SendGrid returns an empty 202 response on success
      return {
        success: true,
        messageId: `direct_${Date.now()}`,
        statusCode: response.status,
        sandboxMode: true
      };
    } else {
      // Handle error response
      const errorData = await response.json();
      console.error('❌ ERROR Response from SendGrid:', errorData);
      
      throw {
        message: 'Failed to send email',
        code: response.status,
        response: {
          body: errorData
        }
      };
    }
  } catch (error) {
    console.error('❌ ERROR: Failed to send email with SendGrid');
    
    if (error.code) console.error('Error code:', error.code);
    if (error.message) console.error('Error message:', error.message);
    
    if (error.response?.body) {
      console.error('Error body:', JSON.stringify(error.response.body));
    }
    
    // Throw a clear error for the frontend
    const detailedError = new Error('Forbidden');
    detailedError.details = error.response?.body || {};
    throw detailedError;
  }
};

module.exports = { sendEmail }; 