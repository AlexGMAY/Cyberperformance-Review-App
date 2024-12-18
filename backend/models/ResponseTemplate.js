const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const responseTemplateSchema = new Schema({  
  goodReviewResponses:  // Pre-written answers for good reviews (3-5 stars)
      {
        type: [String],
        default: [
          "Thank you so much for your kind words!",
          "We’re thrilled to hear you had a great experience with us!",
          "We appreciate your positive feedback and look forward to serving you again!",
          "Your satisfaction means the world to us. Thank you for the glowing review!",
          "Thanks for the awesome review, we hope to see you again soon!",
          "We're so grateful for your feedback! Thanks for sharing your experience.",
          "Thanks for your support! We're glad you enjoyed our service.",
          "Your positive review made our day! We're so happy you enjoyed your experience.",
          "Thanks for choosing us! We're honored to have your recommendation.",
          "We're overjoyed to hear you're satisfied. Your feedback keeps us going!"
        ]
  },
  badReviewResponses:  // Pre-written answers for bad reviews (1-2 stars)
      {
        type: [String],
        default: [
          "We’re sorry to hear that you had a less than ideal experience.",
          "Thank you for your feedback. We will work on improving the areas where we fell short.",
          "We apologize for any inconvenience caused. Please reach out to us directly so we can make it right.",
          "We’re sorry we didn’t meet your expectations. Let’s see how we can improve your experience.",
          "Thank you for bringing this to our attention. We will address this issue promptly.",
          "Your feedback is important to us. We’re working to resolve the issues you faced.",
          "We regret that you had a negative experience. Please give us a chance to improve.",
          "We value your input and will use it to better our services.",
          "We’re sorry you didn’t enjoy your experience. Please contact us so we can make things better.",
          "We take your concerns seriously. Thank you for helping us identify areas for improvement."
        ]
  }    
});

module.exports = mongoose.model('ResponseTemplate', responseTemplateSchema);
