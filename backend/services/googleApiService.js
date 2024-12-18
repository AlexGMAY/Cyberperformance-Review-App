// const axios = require('axios');
// const qs = require('qs');

// // Helper function to get an access token using the refresh token
// const getGoogleAccessToken = async () => {
//   try {
//     const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', qs.stringify({
//       client_id: process.env.GOOGLE_CLIENT_ID,
//       client_secret: process.env.GOOGLE_CLIENT_SECRET,
//       refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
//       grant_type: 'refresh_token',
//     }), {
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     });
    
//     return tokenResponse.data.access_token;
//   } catch (error) {
//     console.error('Error obtaining access token', error);
//     throw new Error('Failed to obtain Google access token');
//   }
// };

// // Function to send the review response
// exports.sendReviewResponseToGoogle = async (reviewId, responseText) => {
//   try {
//     // Step 1: Get access token
//     const accessToken = await getGoogleAccessToken();

//     // Step 2: Send review response to Google
//     const response = await axios.put(
//       `https://mybusiness.googleapis.com/v4/${reviewId}/reply`, // Google API endpoint for review responses
//       {
//         comment: responseText, // The actual response to the review
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     // Step 3: Check if the response was successful
//     if (response.status === 200) {
//       console.log('Successfully responded to the review');
//       return response.data;
//     } else {
//       throw new Error('Failed to send review response');
//     }
//   } catch (error) {
//     console.error('Error responding to review', error);
//     throw new Error('Failed to respond to review');
//   }
// };

// const { createGoogleBusinessAPI } = require('../config/google');

// exports.sendReviewResponseToGoogle = async (reviewId, responseText) => {
//   try {
//     // Initialize the Google My Business API
//     const myBusiness = createGoogleBusinessAPI();
    
//     // Define the API request
//     const res = await myBusiness.accounts.locations.reviews.update({
//       name: `accounts/{accountId}/locations/{locationId}/reviews/${reviewId}`,
//       updateMask: 'comment',
//       requestBody: {
//         comment: responseText,
//       },
//     });

//     // Handle success
//     return res.data;
//   } catch (error) {
//     console.error('Error sending review response:', error);
//     throw new Error('Failed to send review response');
//   }
// };
const { google } = require('googleapis');
const { businessprofileperformance } = require('@googleapis/businessprofileperformance');
const axios = require('axios');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_REFRESH_TOKEN } = process.env;

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

const businessProfile = businessprofileperformance({ version: 'v1', auth: oauth2Client });


// Function to fetch reviews
const fetchReviews = async (locationId) => {
  try {
    const res = await businessProfile.accounts.locations.reviews.list({
      parent: `accounts/{accountId}/locations/${locationId}`
    });
    return res.data.reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw new Error('Unable to fetch reviews');
  }
};

// Function to respond to a review
const respondToReview = async (locationId, reviewId, response) => {
  try {
    await businessProfile.accounts.locations.reviews.updateReply({
      name: `accounts/{accountId}/locations/${locationId}/reviews/${reviewId}`,
      requestBody: {
        reply: response
      }
    });
  } catch (error) {
    console.error('Error responding to review:', error);
    throw new Error('Unable to respond to review');
  }
};

module.exports = { fetchReviews, respondToReview };

