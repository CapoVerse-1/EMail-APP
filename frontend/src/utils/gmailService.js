// Gmail API service
import { createSentEmail } from './supabaseService';

// Get the Gmail API key from local storage
const getGmailApiKey = () => {
  return localStorage.getItem('gmail_api_key') || '';
};

// Function to send an email via Gmail API
const sendEmail = async (apiKey, to, subject, content) => {
  if (!apiKey) {
    throw new Error('Gmail API key not found. Please add your API key in the settings page.');
  }
  
  try {
    // Format email content as base64 encoded string
    const emailContent = btoa(
      `To: ${to}\r\n` +
      `Subject: ${subject}\r\n\r\n` +
      `${content}`
    ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    
    // Call Gmail API to send email
    const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/send?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        raw: emailContent
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to send email');
    }
    
    const data = await response.json();
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