const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');

const customerSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email:  {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Ensure email is unique
    validate: [isEmail, 'Please enter a valid email address'],
  },
  phoneNumber:  {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function(v) {
        return /\+?[0-9]{7,15}/.test(v); // Example regex for phone validation
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  client: { type: Schema.Types.ObjectId, ref: 'Client' }, // Link back to Client model
  followUpHistory: [{
    // Change the 'type' to indicate responses only
    type: { type: String, enum: ['response'] }, // Only indicating that it is a response
    date: Date,
    status: { type: String, enum: ['received', 'opened'] }, // Status of the response
  }],
  googleReviewStatus: { type: String, enum: ['requested', 'submitted', 'not-submitted'], default: 'requested' },
  reviews: [{ // Linking reviews to customers
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Customer', customerSchema);
