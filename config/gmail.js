// Extremely simplified email sending function
const sendEmail = async (to, subject, content) => {
  console.log('=== SIMULATING EMAIL SEND ===');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content length: ${content.length} characters`);
  console.log('============================');
  
  // Always return success
  return {
    success: true,
    messageId: `msg_${Date.now()}`,
    to: to,
    subject: subject
  };
};

// Simplified Gmail client that always succeeds
const getGmailClient = async () => {
  console.log('Creating simulated Gmail client');
  
  return {
    users: {
      messages: {
        send: async ({ userId, requestBody }) => {
          console.log('Simulating email send with Gmail API');
          
          try {
            // Extract email content (very simplified)
            const raw = requestBody.raw || '';
            const emailString = Buffer.from(raw, 'base64').toString('utf8');
            
            // Just use a regex to extract the recipient
            const toMatch = emailString.match(/To: ([^\n]+)/);
            const to = toMatch ? toMatch[1].trim() : 'unknown@example.com';
            
            // Extract subject (simplified)
            const subjectMatch = emailString.match(/Subject: ([^\n]+)/);
            const subject = subjectMatch ? subjectMatch[1].trim() : 'No Subject';
            
            // Always return success response
            console.log(`Simulated email to ${to} with subject ${subject}`);
            return { 
              data: { 
                id: `simulated_${Date.now()}`,
                threadId: `thread_${Date.now()}`
              } 
            };
          } catch (error) {
            // Even if there's an error, return success
            console.error('Error in simulated email (ignoring):', error);
            return { 
              data: { 
                id: `error_handled_${Date.now()}`,
                threadId: `thread_${Date.now()}`
              } 
            };
          }
        }
      }
    }
  };
};

module.exports = { getGmailClient, sendEmail }; 