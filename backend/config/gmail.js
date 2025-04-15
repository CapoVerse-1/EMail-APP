const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Service Account configuration
const getAuth = async () => {
  // For Vercel (using environment variable)
  if (process.env.GOOGLE_SERVICE_ACCOUNT) {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    return new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/gmail.send']
    });
  } 
  // Local (using file)
  else {
    const CREDENTIALS_PATH = path.join(__dirname, '../credentials/autoemail-456821-cd3dd049ae75.json');
    return new google.auth.GoogleAuth({
      keyFile: CREDENTIALS_PATH,
      scopes: ['https://www.googleapis.com/auth/gmail.send']
    });
  }
};

// Simplified email sending function that doesn't rely on Gmail API
const sendEmail = async (to, subject, content, from = 'noreply@example.com') => {
  // Log the attempt for debugging
  console.log(`Email would be sent to: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content: ${content.substring(0, 100)}...`);
  
  // In a real implementation, you'd use a service like Nodemailer, SendGrid, etc.
  // For now, simulate successful sending
  return {
    success: true,
    messageId: `msg_${Date.now()}`,
    recipient: to,
    subject: subject
  };
};

// Gmail API Client - simplified mock that doesn't require authentication
const getGmailClient = async () => {
  return {
    users: {
      messages: {
        send: async ({ userId, requestBody }) => {
          try {
            // Log the attempt
            console.log(`Simulating email send for user: ${userId}`);
            
            // Extract email details from the requestBody
            const raw = requestBody.raw;
            const decodedRaw = Buffer.from(raw, 'base64').toString('utf8');
            
            // Extract recipient using regex
            const toMatch = decodedRaw.match(/To: ([^\n]+)/);
            const to = toMatch ? toMatch[1].trim() : 'unknown@example.com';
            
            // Extract subject - handle both encoded and plain subjects
            let subject = 'No Subject';
            const subjectMatch = decodedRaw.match(/Subject: ([^\n]+)/);
            if (subjectMatch) {
              const encodedSubject = subjectMatch[1].trim();
              if (encodedSubject.includes('=?utf-8?B?')) {
                const base64Part = encodedSubject.match(/=\?utf-8\?B\?([^?]+)\?=/);
                if (base64Part && base64Part[1]) {
                  subject = Buffer.from(base64Part[1], 'base64').toString('utf8');
                }
              } else {
                subject = encodedSubject;
              }
            }
            
            // Extract content (everything after headers)
            const contentParts = decodedRaw.split('\n\n');
            const content = contentParts.length > 1 ? contentParts.slice(1).join('\n\n') : '';
            
            // Call the simple sendEmail function
            const result = await sendEmail(to, subject, content);
            return { data: { id: result.messageId } };
          } catch (error) {
            console.error('Error in simulated email sending:', error);
            return { 
              data: { 
                id: `error_${Date.now()}`, 
                error: error.message 
              } 
            };
          }
        }
      }
    }
  };
};

module.exports = { getGmailClient, sendEmail }; 