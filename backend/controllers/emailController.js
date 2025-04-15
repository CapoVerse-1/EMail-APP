const openai = require('../config/openai');
const { sendEmail: sendGridEmail } = require('../config/sendgrid');
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

// Send email using SendGrid
const sendEmail = async (req, res) => {
  try {
    console.log('\n=== EMAIL SEND REQUEST RECEIVED ===');
    
    const { to, subject, content, from } = req.body;
    console.log(`Request body: to=${to}, subject=${subject?.substring(0, 30)}...`);
    
    // Validate request
    if (!to || !subject || !content) {
      console.error('Missing required fields');
      return res.status(400).json({ 
        success: false, 
        error: 'Failed to send email', 
        details: 'Missing required fields (to, subject, or content)' 
      });
    }

    // Log the full request details
    console.log('Full request body (truncated content):', {
      ...req.body,
      content: req.body.content?.substring(0, 100) + '...'
    });

    // Send email using SendGrid
    console.log('Calling SendGrid service...');
    
    try {
      const result = await sendGridEmail(
        to, 
        subject, 
        content, 
        from || process.env.FROM_EMAIL
      );
  
      console.log('Email send result:', result);
      
      // Return result directly
      return res.status(200).json(result);
    } catch (sendError) {
      console.error('SendGrid service error:', sendError);
      
      // More detailed error for debugging
      return res.status(500).json({
        success: false,
        error: sendError.message || 'Email sending failed',
        details: sendError.details || {},
        code: sendError.code
      });
    }
  } catch (error) {
    console.error('Unexpected error in sendEmail controller:', error);
    
    // Send back detailed error information
    return res.status(500).json({
      success: false,
      error: 'Server error',
      details: {
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? null : error.stack
      }
    });
  }
};

module.exports = {
  generateEmail,
  sendEmail,
}; 