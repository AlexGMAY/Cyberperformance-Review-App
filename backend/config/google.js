const { google } = require('googleapis');

// Function to create an OAuth2 client
const createOAuth2Client = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,     // Client ID from Google Cloud
    process.env.GOOGLE_CLIENT_SECRET, // Client Secret from Google Cloud
    process.env.GOOGLE_REDIRECT_URI   // Redirect URI from Google Cloud
  );

  // Set credentials (Access Token and Refresh Token)
  oauth2Client.setCredentials({
    access_token: process.env.GOOGLE_ACCESS_TOKEN,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return oauth2Client;
};

// Google My Business API instance
const createGoogleBusinessAPI = () => {
  const oauth2Client = createOAuth2Client();
  return google.mybusiness({
    version: 'v4', // Google My Business API version
    auth: oauth2Client
  });
};

module.exports = {
  createOAuth2Client,
  createGoogleBusinessAPI
};
