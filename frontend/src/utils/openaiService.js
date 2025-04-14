// OpenAI API service

// Get the API key from local storage or settings
const getApiKey = () => {
  return localStorage.getItem('openai_api_key') || '';
};

// Create a prompt that includes project settings and company info
const createPrompt = (activeProject, company) => {
  // Default instructions for all emails
  const defaultInstructions = "Write an email that sounds as human as possible. Avoid using dashes, don't use bulletpoints or bold text unless specifically requested. Provide only the raw email content without any introductory or closing text from an AI assistant.";
  
  // Extract project settings if available
  const projectSettings = activeProject?.settings || {};
  const businessDescription = projectSettings.businessDescription || '';
  const emailTemplate = projectSettings.emailTemplate || '';
  const greeting = projectSettings.greeting || 'Dear';
  const outro = projectSettings.outro || '';
  
  // Company information
  const companyName = company.name || '';
  const companyDescription = company.description || '';
  
  // Build the full prompt
  return `${defaultInstructions}

ABOUT MY BUSINESS:
${businessDescription}

ABOUT THE RECIPIENT COMPANY:
Company Name: ${companyName}
Business Description: ${companyDescription}

${emailTemplate ? `REFERENCE EMAIL TEMPLATE:
${emailTemplate}` : ''}

PREFERRED GREETING STYLE:
${greeting}

PREFERRED OUTRO STYLE:
${outro}

Write a personalized email introducing my business to ${companyName}, referencing their work in ${companyDescription.split(' ').slice(0, 4).join(' ')}...`;
};

// Call the OpenAI API to generate content
const generateEmail = async (activeProject, company) => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please add your API key in the settings page.');
  }
  
  const prompt = createPrompt(activeProject, company);
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an email writing assistant that crafts personalized business emails.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate email');
    }
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating email:', error);
    throw error;
  }
};

export { generateEmail }; 