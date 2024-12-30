const express = require('express');
const router = express.Router();
const ReviewRequest = require('../models/reviewRequest');
const Client = require('../models/client');
const Customer = require('../models/customer');

router.get('/', async (req, res) => {
    try {
      const { status, clientId, type } = req.query;
  
      // Build the filter query
      const filter = {};
      if (status) filter.status = status;
      if (clientId) filter.client = clientId;
      if (type) filter.type = type;
  
      const reviewRequests = await ReviewRequest.find(filter)
        .populate('client', 'businessName')
        .populate('customer', 'name email phoneNumber');
  
      res.status(200).json({ success: true, data: reviewRequests });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to fetch review requests', error: err.message });
    }
});
  
  // Create a new review request
  router.post('/', async (req, res) => {
    try {
      const { clientId, customerId, type, scheduledTime, message, reviewLink } = req.body;
  
      const client = await Client.findById(clientId);
      if (!client) return res.status(404).json({ success: false, message: 'Client not found' });
  
      const customer = await Customer.findById(customerId);
      if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
  
      const reviewRequest = new ReviewRequest({
        client: clientId,
        customer: customerId,
        type,
        scheduledTime,
        message,
        reviewLink,
      });
  
      await reviewRequest.save();
      res.status(201).json({ success: true, data: reviewRequest });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to create review request', error: err.message });
    }
  });
  
  // Update a scheduled review request
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { scheduledTime, message } = req.body;
  
      const reviewRequest = await ReviewRequest.findById(id);
      if (!reviewRequest) return res.status(404).json({ success: false, message: 'Review request not found' });
  
      if (scheduledTime) reviewRequest.scheduledTime = scheduledTime;
      if (message) reviewRequest.message = message;
  
      await reviewRequest.save();
      res.status(200).json({ success: true, data: reviewRequest });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to update review request', error: err.message });
    }
  });
  
  // Delete a scheduled review request
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const reviewRequest = await ReviewRequest.findByIdAndDelete(id);
      if (!reviewRequest) return res.status(404).json({ success: false, message: 'Review request not found' });
  
      res.status(200).json({ success: true, message: 'Review request deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to delete review request', error: err.message });
    }
  });
  
  module.exports = router;
  