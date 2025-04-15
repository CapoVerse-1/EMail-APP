// Gmail API service
import { createSentEmail } from './supabaseService';

// API endpoint - make sure it matches the backend port
const API_URL = 'http://localhost:5000/api';

// Get the Gmail API key from local storage
const getGmailApiKey = () => {
  return localStorage.getItem('gmail_api_key') || '';
};

// Function to send an email via Backend
const sendEmail = async (apiKey = null, to, subject, content) => {
  try {
    console.log('Sending email to backend:', { to, subject });
    
    // Call backend API to send email
    const response = await fetch(`${API_URL}/emails/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        content
      })
    });
    
    // Get the response as text first
    const responseText = await response.text();
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', responseText);
      throw new Error('Invalid response from server');
    }
    
    // Check for error in the response
    if (!response.ok || !data.success) {
      const errorMessage = data.error || data.details || 'Failed to send email';
      console.error('Server returned error:', data);
      throw new Error(errorMessage);
    }
    
    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Save sent email to Supabase
const saveSentEmail = async (emailData) => {
  try {
    const sentEmail = await createSentEmail({
      company: emailData.company,
      to_email: emailData.to,
      subject: emailData.subject,
      content: emailData.content,
      status: 'delivered'
    });
    
    return sentEmail;
  } catch (error) {
    console.error('Error saving sent email:', error);
    // Don't throw error for this non-critical function
    return null;
  }
};

// Get all sent emails from local storage
const getSentEmails = () => {
  try {
    return JSON.parse(localStorage.getItem('sent_emails') || '[]');
  } catch (error) {
    console.error('Error getting sent emails:', error);
    return [];
  }
};

export { 
  sendEmail,
  saveSentEmail,
  getSentEmails
}; 