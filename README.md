# Email Automation Tool

A modern web application for generating personalized emails from Excel data using ChatGPT and sending them via SendGrid API.

## Features

- Upload Excel files with company data (email, company name, company description)
- Generate personalized emails using ChatGPT
- Edit, regenerate, and send emails directly via SendGrid
- Configure email templates and AI prompts
- Modern, clean UI with intuitive controls

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express
- **Database**: Supabase
- **APIs**: ChatGPT API, SendGrid API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Supabase account
- OpenAI API key
- SendGrid account with API key

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

### Setting up SendGrid

1. Create a free SendGrid account at [sendgrid.com](https://sendgrid.com/)
2. Go to Settings > API Keys and create a new API key with full access or restricted to "Mail Send" permissions
3. Verify a sender email/domain in the SendGrid dashboard (required to send emails)
4. Add your SendGrid API key and verified sender email to the `.env` file:
   ```
   SENDGRID_API_KEY=your_api_key_here
   FROM_EMAIL=your_verified_sender@example.com
   ```

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