const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Service Account entweder aus Datei oder Umgebungsvariable laden
const getAuth = async () => {
  // Wenn auf Vercel (Umgebungsvariable verwenden)
  if (process.env.GOOGLE_SERVICE_ACCOUNT) {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    return new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/gmail.send']
    });
  } 
  // Lokal (Datei verwenden)
  else {
    const CREDENTIALS_PATH = path.join(__dirname, '../credentials/autoemail-456821-cd3dd049ae75.json');
    return new google.auth.GoogleAuth({
      keyFile: CREDENTIALS_PATH,
      scopes: ['https://www.googleapis.com/auth/gmail.send']
    });
  }
};

// Gmail API Client erstellen
const getGmailClient = async () => {
  const auth = await getAuth();
  const authClient = await auth.getClient();
  return google.gmail({ version: 'v1', auth: authClient });
};

module.exports = { getGmailClient }; 