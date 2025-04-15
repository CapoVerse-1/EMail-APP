const openai = require('../config/openai');
const { getGmailClient } = require('../config/gmail');
const supabase = require('../config/supabase');

// Generate email content using OpenAI
const generateEmail = async (req, res) => {
  try {
    const { companyName, companyDescription, projectSettings } = req.body;

    // Create prompt for OpenAI
    const prompt = `
      ${projectSettings.userCase || ''}
      ${projectSettings.businessDescription || ''}
      
      Please write a personalized email to ${companyName}.
      Company description: ${companyDescription}
      
      The email should:
      - Sound as human as possible
      - Avoid using bullet points or bold text unless specified
      - Not use '-' signs
      - Include a greeting: ${projectSettings.greeting || 'Hello'}
      - Include an outro: ${projectSettings.outro || 'Looking forward to hearing from you.'}
      
      ${projectSettings.emailTemplate || ''}
    `;

    // Generate content with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a professional email writer who creates personalized, human-sounding emails." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
    });

    const generatedEmail = completion.choices[0].message.content;

    // Store in database if needed
    // const { data, error } = await supabase.from('emails').insert([
    //   { company_name: companyName, generated_content: generatedEmail }
    // ]);

    res.status(200).json({ emailContent: generatedEmail });
  } catch (error) {
    console.error('Error generating email:', error);
    res.status(500).json({ error: 'Failed to generate email' });
  }
};

// Send email using Gmail API
const sendEmail = async (req, res) => {
  try {
    const { to, subject, content, from = 'me@example.com' } = req.body;

    // Log the request for debugging
    console.log('Email send request received:', { to, subject, from });

    // Simplified success response without actually sending the email
    // This helps test if the rest of the application works
    res.status(200).json({ 
      success: true, 
      messageId: 'test-message-id',
      message: 'Email would be sent in production environment'
    });
    
    // For a real solution, you would implement an actual email sending method here
    // like nodemailer, SendGrid, or properly configured Gmail API

  } catch (error) {
    console.error('Error in email process:', error);
    res.status(500).json({ error: 'Failed to process email request', details: error.message });
  }
};

module.exports = {
  generateEmail,
  sendEmail,
}; 