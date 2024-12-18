const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'postmark',
  auth: {
    user: process.env.POSTMARK_API_KEY,
  },
});

module.exports = transporter;
