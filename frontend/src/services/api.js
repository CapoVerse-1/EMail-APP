const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Email API service
const emailService = {
  // Generate email content
  generateEmail: async (companyData, projectSettings) => {
    try {
      const response = await fetch(`${API_URL}/emails/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: companyData.name,
          companyDescription: companyData.description,
          projectSettings,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate email');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in generateEmail:', error);
      throw error;
    }
  },

  // Send email
  sendEmail: async (emailData) => {
    try {
      const response = await fetch(`${API_URL}/emails/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailData.to,
          subject: emailData.subject,
          content: emailData.content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in sendEmail:', error);
      throw error;
    }
  },
};

export default {
  email: emailService,
}; 