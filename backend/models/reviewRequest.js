const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewRequestSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  type: {
    type: String,
    enum: ['email', 'sms'],
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'scheduled', 'failed'],
    default: 'scheduled'
  },
  scheduledTime: {
    type: Date,
    required: true
  },
  sentTime: Date,
  message: String,
  reviewLink: String,
});

module.exports = mongoose.model('ReviewRequest', reviewRequestSchema);
