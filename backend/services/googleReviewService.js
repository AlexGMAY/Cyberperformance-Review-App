const { fetchReviews, respondToReview } = require('./googleApiService');
const ResponseTemplate = require('../models/ResponseTemplate');
const Customer = require('../models/customer');
const Review = require('../models/review');
const axios = require('axios');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;

// Function to fetch reviews and respond automatically
const handleGoogleReviews = async (locationId) => {
  try {
    const reviews = await fetchReviews(locationId);

    for (const review of reviews) {
      const { reviewId, starRating, comment } = review;
      
      // Fetch the customer associated with this review (this assumes the customer uses Google Review ID)
      const customer = await Customer.findOne({ googleReviewStatus: 'submitted', reviewId });
      
      if (!customer) {
        console.log('Customer not found for review:', reviewId);
        continue;
      }

      // Store the review in your database
      const savedReview = new Review({
        customer: customer._id,
        reviewId,
        reviewText: comment,
        reviewRating: starRating,
        reviewDate: new Date(review.createTime)
      });
      await savedReview.save();

      // Determine whether it's a good or bad review
      const responseType = starRating >= 3 ? 'good' : 'bad';

      // Fetch pre-written responses for the corresponding type (good/bad)
      const responseTemplates = await ResponseTemplate.find({ type: responseType });

      // Choose a random response from the templates
      const randomIndex = Math.floor(Math.random() * responseTemplates.length);
      const response = responseTemplates[randomIndex].text;

      // Send the response using the Google Business Profile API
      await respondToReview(locationId, reviewId, response);

      // Update the review with the response details
      savedReview.response = response;
      savedReview.responseDate = new Date();
      await savedReview.save();
    }
    
    console.log('Reviews handled successfully');
  } catch (error) {
    console.error('Error handling Google reviews:', error);
  }
};



const getAccessToken = async () => {
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token'
    });

    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error.response?.data || error.message);
    throw new Error("Failed to refresh access token");
  }
};

const sendReviewResponseToGoogle = async (reviewId, responseText) => {
  try {
    // Replace `{accountId}` and `{locationId}` with actual values
    const accountId = process.env.GOOGLE_ACCOUNT_ID;
    const locationId = process.env.GOOGLE_LOCATION_ID;

    // Get a fresh access token
    const accessToken = await getAccessToken();

    const response = await axios.post(
      `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews/${reviewId}/reply`,
      { comment: responseText },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Google API Error:", error.response?.data || error.message);
    throw new Error("Failed to send response to Google");
  }
};

module.exports = { handleGoogleReviews, sendReviewResponseToGoogle};
