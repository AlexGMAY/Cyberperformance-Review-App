const nodemailer = require('nodemailer');

// Initialize nodemailer transporter with Postmark SMTP settings
const transporter = nodemailer.createTransport({
  host: 'smtp.postmarkapp.com',
  port: 587,
  auth: {
    user: process.env.POSTMARK_API_KEY,  // Postmark API Key as the user
    pass: process.env.POSTMARK_API_KEY   // Same API Key as the password for Postmark SMTP
  }
});

const sendEmail = (to, subject, message, reviewLink) => {
  const emailContent = `${message} ${reviewLink}`;
  console.log(`Sending email to: ${to} with subject: ${subject} and content: ${emailContent}`); // Log email details

  const mailOptions = {
    from: process.env.EMAIL_USER,  // Verified sender email in Postmark
    to,
    subject,
    html: emailContent,
  };

  return transporter.sendMail(mailOptions)
    .then(response => {
      console.log(`Email sent successfully: ${response.messageId}`);
    })
    .catch(error => {
      console.error(`Error sending email: ${error.message}`);
    });
};



module.exports = sendEmail;

