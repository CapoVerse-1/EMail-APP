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
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send email');
    }
    
    const data = await response.json();
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
    throw error;
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