const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const smsTemplateSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 250 // Limit for SMS length
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client', // Assuming each client can have their own templates
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('SmsTemplate', smsTemplateSchema);
