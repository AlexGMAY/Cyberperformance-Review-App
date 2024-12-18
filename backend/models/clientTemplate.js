const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Client-Specific Template Schema
const clientTemplateSchema = new Schema({
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  globalTemplate: { type: Schema.Types.ObjectId, ref: 'GlobalTemplate', required: true },
  subject: { type: String, default: null }, // For emails
  content: { type: String, required: true }, // Customized content
}, { timestamps: true });

module.exports = mongoose.model('ClientTemplate', clientTemplateSchema);
