const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const Client = require('./client'); 

// Review Schema
const reviewSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client', // Reference to the Client model
    required: true
  },
  reviewId: {  // Google Review ID
    type: String,
  },
  reviewText: {
    type: String,
    required: true
  },
  reviewRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  reviewDate: {
    type: Date,
    default: Date.now
  },
  response: {
    type: String,
    default: ""  // This will store the selected or customized response
  },
  responseDate: {
    type: Date
  },
  responseHistory: [{
    responseText: String,
    responseDate: Date
  }],  
});

reviewSchema.methods.autoRespondToReview = async function () {
  // Fetch the customer and their associated client
  const customer = await mongoose.model('Customer').findById(this.customer).populate('client');
  if (!customer || !customer.client) {
    throw new Error('Customer or associated client not found');
  }

  const client = customer.client;

  // Ensure reviewResponses exists in the client
  const goodResponses = client.reviewResponses?.goodReviewResponses?.[0] || [
    "Thank you for your feedback!"
  ];
  const badResponses = client.reviewResponses?.badReviewResponses?.[0] || [
    "We regret that you had a negative experience."
  ];
  
  // Select pre-written responses from the client's settings
  if (this.reviewRating >= 3) {
    // Good review: choose randomly from goodReviewResponses
    this.response = goodResponses[Math.floor(Math.random() * goodResponses.length)];
  } else {
    // Bad review: choose randomly from badReviewResponses
    this.response = badResponses[Math.floor(Math.random() * badResponses.length)];
  }

  // Set response date
  this.responseDate = new Date();

   // Ensure responseHistory array is initialized
   if (!this.responseHistory) {
    this.responseHistory = [];
  }

  // Update the responseHistory with the latest response
  this.responseHistory.push({
    responseText: this.response,
    responseDate: this.responseDate
  });

  // Save the updated review document
  await this.save(); // Ensure you save to persist changes
};

module.exports = mongoose.model('Review', reviewSchema);