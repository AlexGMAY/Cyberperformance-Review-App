const Client = require('../models/client');
const Admin = require('../models/Admin');

// Get all pre-written responses for a client (either by Admin or Client)
exports.getResponses = async (req, res) => {
  try {
    const { clientId } = req.params;  // This can be optional

    let client;

    // Check if the requester is an Admin
    if (req.admin) {
      // If an Admin, allow fetching any client's responses (clientId passed in URL or body)
      if (clientId) {
        client = await Client.findById(clientId);
      } else {
        return res.status(400).json({ message: 'Client ID is required for Admins' });
      }
    } else if (req.client) {
      // If a Client, they can only fetch their own responses
      client = await Client.findById(req.client._id);
    }

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Return pre-written review responses
    res.json({
      goodReviews: client.reviewResponses.goodReviews,
      badReviews: client.reviewResponses.badReviews
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch responses', error });
  }
};

// Update a specific pre-written response (Admin or Client)
exports.updateResponse = async (req, res) => {
  try {
    const { clientId, type, index } = req.params;
    const { newResponse } = req.body;

    let client;

    // Check if the requester is an Admin
    if (req.admin) {
      if (clientId) {
        client = await Client.findById(clientId);
      } else {
        return res.status(400).json({ message: 'Client ID is required for Admins' });
      }
    } else if (req.client) {
      // A Client can only update their own responses
      client = await Client.findById(req.client._id);
    }

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Update the specific response
    if (type === 'good') {
      client.reviewResponses.goodReviews[index] = newResponse;
    } else if (type === 'bad') {
      client.reviewResponses.badReviews[index] = newResponse;
    } else {
      return res.status(400).json({ message: 'Invalid response type' });
    }

    await client.save();
    res.json({ message: 'Response updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update response', error });
  }
};

