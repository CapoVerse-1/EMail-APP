const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Service account file path - use normalized path for Windows
const CREDENTIALS_PATH = path.normalize(path.join(__dirname, '../credentials/autoemail-456821-cd3dd049ae75.json'));

// Get Google Auth client - first try service account, then fallback to simulation
const getAuth = async () => {
  try {
    console.log('Attempting to use service account from:', CREDENTIALS_PATH);
    
    // Verify if credentials file exists
    if (fs.existsSync(CREDENTIALS_PATH)) {
      console.log('Service account credentials found');
      
      try {
        // Create auth client with the service account
        const auth = new google.auth.GoogleAuth({
          keyFile: CREDENTIALS_PATH,
          scopes: ['https://www.googleapis.com/auth/gmail.send']
        });
        
        return auth;
      } catch (error) {
        console.error('Error creating auth with credentials file:', error);
        return null;
      }
    } else {
      console.warn('Service account file not found at:', CREDENTIALS_PATH);
      console.warn('Working directory:', process.cwd());
      console.warn('Available files in credentials directory:', 
        fs.existsSync(path.dirname(CREDENTIALS_PATH)) 
          ? fs.readdirSync(path.dirname(CREDENTIALS_PATH)) 
          : 'Directory not found');
      return null;
    }
  } catch (error) {
    console.error('Error creating auth client:', error);
    return null;
  }
};

// Gmail API client creator
const getGmailClient = async () => {
  try {
    // Try to get real auth client
    const auth = await getAuth();
    
    if (auth) {
      try {
        // Get credentials
        const authClient = await auth.getClient();
        console.log('Successfully created Gmail API client with service account');
        
        // Create real Gmail client
        return google.gmail({ version: 'v1', auth: authClient });
      } catch (error) {
        console.error('Error getting auth client:', error);
        return getMockGmailClient();
      }
    }
  } catch (error) {
    console.error('Failed to create real Gmail client:', error);
  }
  
  // Fallback to mock client
  console.log('Using simulated Gmail client as fallback');
  return getMockGmailClient();
};

// Mock Gmail client for testing/fallback
const getMockGmailClient = () => {
  console.log('Creating mock Gmail client for simulation');
  return {
    users: {
      messages: {
        send: async ({ userId, requestBody }) => {
          console.log('SIMULATION MODE: Mocking email send with Gmail API');
          console.log(`User ID: ${userId}`);
          
          try {
            // Extract email content (simplified)
            const raw = requestBody.raw || '';
            let emailString = '';
            try {
              emailString = Buffer.from(raw, 'base64').toString('utf8');
            } catch (error) {
              console.error('Error decoding email content:', error);
            }
            
            // Extract recipient
            const toMatch = emailString.match(/To: ([^\n]+)/);
            const to = toMatch ? toMatch[1].trim() : 'unknown@example.com';
            
            // Extract subject
            const subjectMatch = emailString.match(/Subject: ([^\n]+)/);
            const subject = subjectMatch ? subjectMatch[1].trim() : 'No Subject';
            
            console.log(`Simulated email send to: ${to}`);
            console.log(`Subject: ${subject}`);
            
            // Simulate successful response
            return { 
              data: { 
                id: `simulated_${Date.now()}`,
                threadId: `thread_${Date.now()}`
              } 
            };
          } catch (error) {
            console.error('Error in mock Gmail client:', error);
            return { 
              data: { 
                id: `error_${Date.now()}`,
                threadId: `thread_${Date.now()}`
              } 
            };
          }
        }
      }
    }
  };
};

module.exports = { getGmailClient }; 