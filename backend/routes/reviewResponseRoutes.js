const express = require('express');
const ResponseTemplate = require('../models/ResponseTemplate'); // Adjust the path as needed
const router = express.Router();
const Client = require('../models/client');

// PUT route to update review responses for a specific client
exports.updateReviewResponses = async (req, res) => {
  const { clientId } = req.params;
  const { goodReviewResponses, badReviewResponses } = req.body;

  try {
    // Find the client
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Update good review responses
    if (goodReviewResponses && Array.isArray(goodReviewResponses)) {
      client.reviewResponses.goodReviewResponses = goodReviewResponses;
    }

    // Update bad review responses
    if (badReviewResponses && Array.isArray(badReviewResponses)) {
      client.reviewResponses.badReviewResponses = badReviewResponses;
    }

    // Save the updated client
    await client.save();

    res.status(200).json({ message: 'Responses updated successfully', client });
  } catch (error) {
    console.error('Error updating responses:', error);
    res.status(500).json({ message: 'Failed to update responses', error });
  }
};

// GET endpoint to fetch current responses for a client
router.get('/review-responses/:clientId', async (req, res) => {
  const { clientId } = req.params;

  try {
    const responses = await ResponseTemplate.find({ clientId });
    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch responses', error: error.message });
  }
});


module.exports = router;
