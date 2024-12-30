const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSms = async (to, message, reviewLink) => {
  try {
    const fullMessage = `${message}\nReview here: ${reviewLink}`;
    await client.messages.create({
      body: fullMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    console.log(`SMS sent to ${to}`);
  } catch (err) {
    console.error('Failed to send SMS:', err);
  }
};

module.exports = sendSms;
