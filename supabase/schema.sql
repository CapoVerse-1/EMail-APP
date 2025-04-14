-- Projects table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  settings JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Companies table (for storing company data)
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated emails table
CREATE TABLE generated_emails (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  email_type TEXT NOT NULL,
  model TEXT NOT NULL,
  subject TEXT,
  is_regenerated BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sent emails table
CREATE TABLE sent_emails (
  id SERIAL PRIMARY KEY,
  company TEXT NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'delivered',
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings table (for API keys)
CREATE TABLE user_settings (
  id SERIAL PRIMARY KEY,
  openai_api_key TEXT,
  gmail_api_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_generated_emails_updated_at
BEFORE UPDATE ON generated_emails
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
BEFORE UPDATE ON user_settings
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Insert default row in user_settings
INSERT INTO user_settings (openai_api_key, gmail_api_key) VALUES ('', '');

-- Insert default project
INSERT INTO projects (
  name, 
  description, 
  settings, 
  is_active
) VALUES (
  'Default Project',
  'Your default email generation project',
  '{
    "businessDescription": "We are a software company specializing in AI-powered automation tools for businesses. Our solutions help streamline workflows and increase productivity.",
    "emailTemplate": "Dear [Company],\n\nI came across your website and was impressed by your work in [Industry]. I believe our services could greatly benefit your operations.\n\nWould you be available for a quick call next week?\n\nBest regards,\nYour Name",
    "greeting": "Hello,",
    "outro": "Looking forward to hearing from you."
  }',
  true
); 