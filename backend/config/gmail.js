const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config();

// Setup OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set credentials
oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// Create Gmail API client
const gmail = google.gmail({
  version: 'v1',
  auth: oAuth2Client,
});

module.exports = { gmail, oAuth2Client }; 