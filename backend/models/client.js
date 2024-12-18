const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
  googleId: { type: String, unique: true },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },  
  phone: {
    type: String,
    required: false,
    unique: true,
  },
  role: {
    type: String,
    enum: ['clientEmployee'], // Employees will always have this role
    default: 'clientEmployee',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const clientSchema = new mongoose.Schema({
  googleId: { type: String, unique: true },
  businessName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true  // Store the hashed password
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },  
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  reviewLink: {
    type: String,    
  },
  googleReviewLink: { type: String }, // Optional GMB review link
  emailPreferences: {
    enabled: { type: Boolean, default: true },
    followUpCount: { type: Number, default: 3 },
    messageTemplate: { type: String, default: 'Please leave us a review!' },
    frequency: { type: Number, default: 24 }, // Frequency in hours for follow-up emails
  },
  smsPreferences: {
    enabled: { type: Boolean, default: true },
    followUpCount: { type: Number, default: 3 },
    messageTemplate: { type: String, default: 'We would love your feedback! Please leave us a review.' },
    frequency: { type: Number, default: 24 } // Frequency in hours for follow-up SMS
  },
  followUpHistory: [{
    type: { type: String, enum: ['email', 'sms'] },
    date: Date,
    status: { type: String, enum: ['sent', 'delivered', 'opened', 'clicked'] },
  }],  
  followUpSchedule: {
    email: { type: [String], default: ['2', '3', '4'] }, // Array of strings for email schedule
    sms: { type: [String], default: ['1', '5', '7'] }    // Array of strings for SMS schedule
  },
  customers: [{ type: Schema.Types.ObjectId, ref: 'Customer' }],
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  employees: [employeeSchema], // Array of employees belonging to this client
  
  // Add pre-written responses for both good and bad reviews  
  reviewResponses: {
    goodReviewResponses: { type: [String], default: [] },
    badReviewResponses: { type: [String], default: [] }
  },

  // Notification Preferences
  notificationPreferences: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: true },
    notificationFrequency: { type: Number, default: 24 }, // Frequency in hours
  },
  // General Settings
  profilePicture: { type: String }, // URL to profile picture
  timeZone: { type: String, default: 'UTC' },
  language: { type: String, default: 'en' },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Method to compare passwords
clientSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the model
module.exports = mongoose.model('Client', clientSchema);
