const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
});

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema); // Ensure model name is correct here
