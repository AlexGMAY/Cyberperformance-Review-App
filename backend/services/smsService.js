const twilio = require('twilio');
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const sendSms = (to, message, reviewLink) => {
  console.log(`Sending SMS to: ${to} with message: ${message} and link: ${reviewLink}`); // Log SMS details

  return client.messages.create({
    body: `${message} ${reviewLink}`,
    from: TWILIO_PHONE_NUMBER,
    to,
    statusCallback: 'https://<ngrok http 5520>/twilio/sms-status' 
  }).then(message => {
    console.log(`SMS sent successfully: ${message.sid}`);
  }).catch(error => {
    console.error(`Error sending SMS: ${error.message}`);
  });
};

module.exports = sendSms;

