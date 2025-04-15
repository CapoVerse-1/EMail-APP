const { OpenAI } = require('openai');
const dotenv = require('dotenv');

dotenv.config();

// Create a mock OpenAI client for development/testing
const createMockOpenAI = () => {
  console.log('Using mock OpenAI client');
  return {
    chat: {
      completions: {
        create: async ({ messages }) => {
          console.log('MOCK: OpenAI API call with messages:', messages.length);
          return {
            choices: [
              {
                message: {
                  content: "This is a mock response from the OpenAI API. The actual API is not being called."
                }
              }
            ]
          };
        }
      }
    }
  };
};

// Try to initialize OpenAI client, fall back to mock if error
let openai;
try {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('sk-mock')) {
    openai = createMockOpenAI();
  } else {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('OpenAI client initialized with provided API key');
  }
} catch (error) {
  console.error('Error initializing OpenAI client:', error);
  openai = createMockOpenAI();
}

module.exports = openai; 