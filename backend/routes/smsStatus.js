const express = require('express');
const Client = require('../models/client');
const router = express.Router();

router.post('/twilio/sms-status', (req, res) => {
  const { MessageStatus, To } = req.body;

  console.log(`Received SMS status update for ${To}: ${MessageStatus}`);

  // Update the client's follow-up history with the status
  Client.findOneAndUpdate(
    { phoneNumber: To },
    { $push: { followUpHistory: { type: 'sms', status: MessageStatus, timestamp: new Date() } } }
  )
    .then(() => res.status(200).send('SMS status updated'))
    .catch(err => res.status(500).send(err));
});

module.exports = router;
