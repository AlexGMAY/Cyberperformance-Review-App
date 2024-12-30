const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Postmark', // Or your chosen email service
  auth: {
    user: process.env.POSTMARK_API_KEY,
    pass: process.env.POSTMARK_API_KEY,
  },
});

const sendEmail = async (to, subject, message, reviewLink) => {
  console.log(`Sending email to: ${to} with subject: ${subject}`);
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Verified sender email in Postmark
      to,
      subject,
      text: `${message}\nPlease leave your review here: ${reviewLink}`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error('Failed to send email:', err);
  }
};

module.exports = sendEmail;
