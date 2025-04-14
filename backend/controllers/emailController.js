const openai = require('../config/openai');
const { gmail } = require('../config/gmail');
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
    const { to, subject, content } = req.body;

    // Create the email in base64 format
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `From: Me <me@example.com>`,
      `To: ${to}`,
      `Subject: ${utf8Subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8',
      '',
      content,
    ];
    const message = messageParts.join('\n');
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Send the email
    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    // Store in database if needed
    // const { data, error } = await supabase.from('sent_emails').insert([
    //   { to_email: to, subject, content }
    // ]);

    res.status(200).json({ success: true, messageId: result.data.id });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

module.exports = {
  generateEmail,
  sendEmail,
}; 