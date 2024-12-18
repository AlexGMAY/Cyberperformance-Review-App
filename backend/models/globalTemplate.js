const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Global Template Schema
const globalTemplateSchema = new Schema({
  type: { type: String, enum: ['sms', 'email'], required: true }, // 'sms' or 'email'
  name: { type: String, enum: ['initialRequest', 'reminder'], required: true }, // 'initialRequest' or 'reminder'
  subject: { type: String, default: null }, // For emails
  content: { type: String, required: true }, // Content with placeholders
}, { timestamps: true });

module.exports = mongoose.model('GlobalTemplate', globalTemplateSchema);

