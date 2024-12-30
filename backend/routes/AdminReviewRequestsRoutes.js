const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const ReviewRequest = require('../models/reviewRequest');
const sendSms = require('../services/adminSmsService'); // Assume you have a service for SMS
const sendEmail = require('../services/adminEmailService'); // Assume you have a service for Email
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

// Function to dynamically schedule a review request
const scheduleReviewRequest = async (reviewRequest) => {
  const { type, scheduledTime, message, reviewLink, customer } = reviewRequest;

  const now = new Date();
  const delay = new Date(scheduledTime) - now;

  if (delay <= 0) {
    console.error('Scheduled time must be in the future.');
    return;
  }

  // Use setTimeout for one-time scheduling
  setTimeout(async () => {
    try {
      const customerDetails = await Customer.findById(customer);
      if (!customerDetails) {
        console.error('Customer not found');
        return;
      }

      if (type === 'email' && customerDetails.email) {
        await sendEmail(customerDetails.email, 'Review Request', message, reviewLink);
        console.log(`Email sent to ${customerDetails.email}`);
      } else if (type === 'sms' && customerDetails.phoneNumber) {
        await sendSms(customerDetails.phoneNumber, message, reviewLink);
        console.log(`SMS sent to ${customerDetails.phoneNumber}`);
      }

      // Mark request as completed
      reviewRequest.status = 'sent';
      await reviewRequest.save();
    } catch (err) {
      console.error('Failed to process review request:', err);
    }
  }, delay);
};


// Route to create a new review request
router.post('/', async (req, res) => {
  try {
    const { clientId, customerId, type, scheduledTime, message, reviewLink } = req.body;

    // Validate client and customer existence
    const client = await Client.findById(clientId);
    if (!client) return res.status(404).json({ success: false, message: 'Client not found' });

    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });

    // Create and save the review request
    const reviewRequest = new ReviewRequest({
      client: clientId,
      customer: customerId,
      type,
      scheduledTime,
      message,
      reviewLink,
      status: 'scheduled',
    });

    await reviewRequest.save();

    // Schedule the review request
    await scheduleReviewRequest(reviewRequest);

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
  