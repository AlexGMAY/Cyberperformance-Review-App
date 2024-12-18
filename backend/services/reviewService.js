const mongoose = require('mongoose');
const Client = require('../models/client'); // Update the path as needed
const Customer = require('../models/customer'); // Update the path as needed
const Review = require('../models/review'); // Update the path as needed

exports.submitReview = async (req, res) => {
  const { client, customer, reviewText, reviewRating } = req.body;

  try {
    // Manually cast client and customer IDs to ObjectId
    const clientId = new mongoose.Types.ObjectId(client);
    const customerId = new mongoose.Types.ObjectId(customer);

    // Validate the client and customer
    const foundClient = await Client.findById(clientId);
    if (!foundClient) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const foundCustomer = await Customer.findById(customerId);
    if (!foundCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Ensure review responses exist in the client
    const goodResponses = foundClient.reviewResponses?.goodReviewResponses || [
      "Thank you for your feedback!"
    ];
    const badResponses = foundClient.reviewResponses?.badReviewResponses || [
      "We regret that you had a negative experience."
    ];

    // Select an appropriate auto-response based on the review rating
    const autoResponse =
      reviewRating >= 3
        ? goodResponses[Math.floor(Math.random() * goodResponses.length)]
        : badResponses[Math.floor(Math.random() * badResponses.length)];

    // Create a new review
    const newReview = new Review({
      client: clientId,
      customer: customerId,
      reviewText,
      reviewRating,
      response: autoResponse,
      reviewDate: new Date(),
      responseDate: new Date(),
      responseHistory: [
        {
          responseText: autoResponse,
          responseDate: new Date(),
        },
      ],
    });

    await newReview.save();

    // Link the review to the client
    foundClient.reviews = foundClient.reviews || [];
    foundClient.reviews.push(newReview._id);
    await foundClient.save();

    // Link the review to the customer
    foundCustomer.reviews = foundCustomer.reviews || [];
    foundCustomer.reviews.push(newReview._id);
    await foundCustomer.save();

    // Send a success response
    res.status(201).json({ message: 'Review submitted successfully', review: newReview });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({
      error: 'An error occurred while submitting the review',
      details: error.message,
    });
  }
};
