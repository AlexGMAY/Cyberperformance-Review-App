const cron = require('node-cron');
const ReviewRequest = require('../models/reviewRequest');
const sendSms = require('./adminSmsService'); // Assume you have a service for SMS
const sendEmail = require('./adminEmailService'); // Assume you have a service for Email
const shortenLink = require('./shortenLinkService');

// Function to process and send pending review requests
const processReviewRequests = async () => {
  try {
    const now = new Date();

    // Fetch review requests where `scheduledTime` is due and `status` is "pending"
    const pendingRequests = await ReviewRequest.find({
      scheduledTime: { $lte: now },
      status: 'pending',
    });

    for (const request of pendingRequests) {
      const shortenedReviewLink = await shortenLink(request.reviewLink);
      if (request.type === 'email') {
        // Send email
        await sendEmail(request.customer.email, 'Review Request', request.message, shortenedReviewLink);
      } else if (request.type === 'sms') {
        // Send SMS
        await sendSms(request.customer.phoneNumber, request.message, shortenedReviewLink);
      }

      // Mark request as completed
      request.status = 'completed';
      await request.save();
    }
  } catch (err) {
    console.error('Error processing review requests:', err);
  }
};

// Schedule the cron job to run every minute
cron.schedule('* * * * *', processReviewRequests);

module.exports = processReviewRequests;
