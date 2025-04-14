# Email Automation Tool

A modern web application for generating personalized emails from Excel data using ChatGPT and sending them via Gmail API.

## Features

- Upload Excel files with company data (email, company name, company description)
- Generate personalized emails using ChatGPT
- Edit, regenerate, and send emails directly
- Configure email templates and AI prompts
- Modern, clean UI with intuitive controls

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express
- **Database**: Supabase
- **APIs**: ChatGPT API, Gmail API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Supabase account
- OpenAI API key
- Google Cloud Platform account with Gmail API enabled

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```
3. Create a `.env` file in the backend directory with your API keys (use .env.example as a template)
4. Start the development servers:
   ```
   # Backend
   cd backend
   npm run dev

   # Frontend
   cd frontend
   npm start
   ```

### Setting up Gmail API

1. Create a project in Google Cloud Console
2. Enable the Gmail API
3. Create OAuth 2.0 credentials
4. Configure the OAuth consent screen
5. Use the credentials in your .env file

## Project Structure

```
├── frontend/                # React frontend
│   ├── public/              # Public assets
│   └── src/
│       ├── components/      # Reusable components
│       ├── pages/           # Page components
│       ├── services/        # API services
│       ├── context/         # React context
│       ├── hooks/           # Custom React hooks
│       ├── utils/           # Utility functions
│       ├── styles/          # CSS styles
│       └── assets/          # Images and other assets
│
└── backend/                 # Node.js backend
    ├── config/              # Configuration files
    ├── controllers/         # Request controllers
    ├── middleware/          # Express middleware
    ├── models/              # Data models
    ├── routes/              # API routes
    └── utils/               # Utility functions
``` 