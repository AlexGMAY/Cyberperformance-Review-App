const Review = require('../models/review');
const Client = require('../models/client');
const Customer = require('../models/customer');
const googleReviewService = require('../services/googleReviewService'); // Optional, for Google API integration
const mongoose = require('mongoose'); 

exports.createReview = async (req, res) => {
  try {
    const { customerId, reviewText, reviewRating } = req.body;

    if (!customerId) {
      return res.status(400).json({ message: 'Customer ID is required' });
    }

    const customer = await Customer.findById(customerId).populate('client');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const review = new Review({
      customer: customerId,
      reviewText,
      reviewRating,
      reviewDate: new Date()
    });

    const savedReview = await review.save();

    await Customer.findByIdAndUpdate(customerId, {
      $push: { reviews: savedReview._id }
    });

    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Failed to create review', error: error.message });
  }
};

exports.getReviewsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: 'Invalid Customer ID' });
    }

    const customer = await Customer.findById(customerId).populate('reviews');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(customer.reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
};

// exports.respondToReview = async (req, res) => {
//   const { reviewId } = req.params;
//   const { responseText } = req.body;

//   try {
//     const review = await Review.findById(reviewId);
//     if (!review) {
//       return res.status(404).json({ message: "Review not found" });
//     }

//     review.response = responseText;
//     review.responseDate = new Date();
//     await review.save();

//     try {
//       await googleReviewService.sendReviewResponse(reviewId, responseText);
//     } catch (googleError) {
//       console.error("Error sending response to Google:", googleError);
//       return res.status(500).json({
//         message: "Response saved, but failed to send to Google",
//         error: googleError.message,
//       });
//     }

//     res.json({ message: "Response added successfully", review });
//   } catch (error) {
//     console.error("Error responding to review:", error);
//     res.status(500).json({ message: "Failed to respond to review" });
//   }
// };

exports.respondToReview = async (req, res) => {
  const { reviewId } = req.params;
  const { responseText } = req.body;

  try {
    // Find the review by ID
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Initialize responseHistory if it doesn't exist
    review.responseHistory = review.responseHistory || [];

    // Update the response and response date
    const responseDate = new Date();
    review.response = responseText;
    review.responseDate = responseDate;

    // Add the new response to the response history
    review.responseHistory.push({
      responseText: responseText, // Ensure the value is saved in the proper field
      responseDate: responseDate
    });

    // Save the updated review
    await review.save();

    // Send success response
    res.json({ message: "Response added successfully", review });
  } catch (error) {
    console.error("Error responding to review:", error);
    res.status(500).json({ message: "Failed to respond to review", error: error.message });
  }
};


exports.sendGoogleResponse = async (req, res) => {
  const { reviewId } = req.params;
  const { responseText } = req.body;

  try {
    const googleResponse = await googleReviewService.sendReviewResponseToGoogle(reviewId, responseText);
    res.json({ message: "Response sent to Google successfully", googleResponse });
  } catch (error) {
    res.status(500).json({ message: "Failed to send response to Google", error: error.message });
  }
};

// Controller to fetch response statistics for a specific client
exports.getResponseStats = async (req, res) => {
  try {
    const { clientId } = req.params;

    // Total number of reviews for this client
    const totalReviews = await Review.countDocuments({ client: clientId });

    // Number of reviews with responses
    const respondedReviews = await Review.countDocuments({ client: clientId, response: { $exists: true, $ne: "" } });

    // Number of reviews without responses
    const unansweredReviews = totalReviews - respondedReviews;

    // Send back the response statistics
    res.json({
      totalReviews,
      respondedReviews,
      unansweredReviews,
    });
  } catch (error) {
    console.error("Error fetching response stats:", error);
    res.status(500).json({ message: "Failed to fetch response statistics" });
  }
};

