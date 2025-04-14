// OpenAI API service

// Get the API key from local storage or settings
const getApiKey = () => {
  // First try to get from ProjectContext (which loads from Supabase)
  // If that fails, fall back to localStorage (for legacy support)
  const contextKey = window.apiKeyFromContext || '';
  return contextKey || localStorage.getItem('openai_api_key') || '';
};

// Email types with their specific instructions
const emailTypeInstructions = {
  'cold-outreach': "Write a cold outreach email that is concise, personalized, and focuses on providing value to the recipient. The email should clearly state the purpose without being pushy.",
  'follow-up': "Write a friendly follow-up email that references our previous communication. Don't be pushy but express continued interest in collaboration.",
  'partnership': "Write an email proposing a partnership opportunity that highlights mutual benefits. Focus on synergies between our businesses.",
  'introduction': "Write an introductory email that clearly explains who we are and what we do. Keep it concise and focused on potential value to the recipient.",
  'request': "Write a polite email requesting information or a meeting. Be clear about what specific information or outcome we're seeking."
};

// Create a prompt that includes project settings and company info
const createPrompt = (activeProject, company, emailType = 'introduction') => {
  // Default instructions for all emails
  const defaultInstructions = "Write an email that sounds as human as possible. Avoid using dashes, don't use bulletpoints or bold text unless specifically requested. Provide only the raw email content without any introductory or closing text from an AI assistant.";
  
  // Get type-specific instructions
  const typeInstructions = emailTypeInstructions[emailType] || emailTypeInstructions['introduction'];
  
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

${typeInstructions}

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

Write a personalized ${emailType} email introducing my business to ${companyName}, referencing their work in ${companyDescription.split(' ').slice(0, 4).join(' ')}...`;
};

// Call the OpenAI API to generate content
const generateEmail = async (activeProject, company, options = {}) => {
  const { 
    emailType = 'introduction',
    model = 'gpt-3.5-turbo',
    temperature = 0.7,
    maxTokens = 500
  } = options;
  
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please add your API key in the settings page.');
  }
  
  const prompt = createPrompt(activeProject, company, emailType);
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
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
        temperature: temperature,
        max_tokens: maxTokens
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

// Available models
const availableModels = [
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and cost-effective for most basic emails' },
  { id: 'gpt-4', name: 'GPT-4', description: 'More sophisticated and nuanced emails with better understanding of context' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Latest GPT-4 model with improved capabilities' }
];

// Available email types
const availableEmailTypes = [
  { id: 'introduction', name: 'Introduction', description: 'Introduce your business to a new potential client' },
  { id: 'cold-outreach', name: 'Cold Outreach', description: 'First contact with a prospect you have not previously engaged with' },
  { id: 'follow-up', name: 'Follow-up', description: 'Follow up on previous communication' },
  { id: 'partnership', name: 'Partnership Proposal', description: 'Propose a partnership or collaboration' },
  { id: 'request', name: 'Information Request', description: 'Request specific information or a meeting' }
];

export { 
  generateEmail,
  availableModels,
  availableEmailTypes
}; 