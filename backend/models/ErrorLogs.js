const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const errorLogSchema = new Schema({
  serviceName: {
    type: String,
    required: true,
  },
  errorMessage: {
    type: String,
    required: true,
  },
  stackTrace: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ErrorLog', errorLogSchema);
