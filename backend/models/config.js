const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    enum: ['Twilio', 'Postmark'],
    required: true,
  },
  apiKey: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Config', configSchema);
