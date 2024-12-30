const cron = require('node-cron');
const Client = require('../models/client');
const sendSms = require('./smsService');
const sendEmail = require('./emailService');
const shortenLink = require('./shortenLinkService');

// Function to schedule review requests and follow-ups
const scheduleReviewRequests = async () => {
  try {
    const clients = await Client.find().populate('customers'); // Populate associated customers for each client
    for (const client of clients) {
      const { emailPreferences, smsPreferences, customers } = client;

      console.log(`Scheduling for client: ${client.businessName}`);

      // Loop through each customer to schedule their review requests
      for (const customer of customers) {
        const reviewLink = client.googleReviewLink || `${process.env.REVIEW_LINK_BASE_URL}/review/${client._id}/${customer._id}`;
        const shortenedReviewLink = await shortenLink(reviewLink);

        // Schedule email review requests
        if (emailPreferences.enabled) {
          // Initial email
          cron.schedule('0 9 * * *', () => {
            sendEmail(customer.email, 'We’d Love Your Feedback', emailPreferences.messageTemplate, shortenedReviewLink);
          });

          // Email follow-ups
          for (let i = 1; i <= emailPreferences.followUpCount; i++) {
            const followUpTime = i * emailPreferences.frequency * 24 * 60 * 60 * 1000; // Convert days to milliseconds
            setTimeout(() => {
              sendEmail(customer.email, 'Reminder: We’d Love Your Feedback', emailPreferences.messageTemplate, shortenedReviewLink);
            }, followUpTime);
          }
        }

        // Schedule SMS review requests
        if (smsPreferences.enabled) {
          // Initial SMS
          cron.schedule('0 10 * * *', () => {
            sendSms(customer.phoneNumber, smsPreferences.messageTemplate, shortenedReviewLink);
          });

          // SMS follow-ups
          for (let i = 1; i <= smsPreferences.followUpCount; i++) {
            const followUpTime = i * smsPreferences.frequency * 24 * 60 * 60 * 1000; // Convert days to milliseconds
            setTimeout(() => {
              sendSms(customer.phoneNumber, 'Reminder: We’d Love Your Feedback', smsPreferences.messageTemplate, shortenedReviewLink);
            }, followUpTime);
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = scheduleReviewRequests;
