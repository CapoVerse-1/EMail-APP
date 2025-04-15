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
    console.log('=== EMAIL SEND REQUEST RECEIVED ===');
    
    const { to, subject, content, from } = req.body;
    console.log(`Request body: to=${to}, subject=${subject?.substring(0, 30)}...`);
    
    // Validate request
    if (!to || !subject || !content) {
      console.error('Missing required fields');
      return res.status(400).json({ 
        error: 'Failed to send email', 
        details: 'Missing required fields (to, subject, or content)' 
      });
    }

    // Send email using SendGrid - don't wrap in try/catch to allow errors to propagate
    console.log('Calling SendGrid service...');
    const result = await sendGridEmail(
      to, 
      subject, 
      content, 
      from || process.env.FROM_EMAIL
    );

    console.log('Email send result:', result);
    
    // Return result directly
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in sendEmail controller:', error);
    
    // Always return the actual error in development for debugging
    return res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.body || 'Unknown error'
    });
  }
};

module.exports = {
  generateEmail,
  sendEmail,
}; 