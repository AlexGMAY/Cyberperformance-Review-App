const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Client = require('../models/client'); // Adjust the path as needed
const EmailTemplate = require('../models/emailTemplate');
const SmsTemplate = require('../models/smsTemplate');
const ResponseTemplate = require('../models/ResponseTemplate'); 

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected...');
    reinitializeReviewResponses(); // Call the function after successful connection
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// const updateClients = async () => {  

//   const clients = await Client.find();

//   // Update each client with a default googleReviewLink if not already set
//   for (let client of clients) {
//     if (!client.googleReviewLink) {
//       client.googleReviewLink = 'https://www.google.com/reviews'; // Default link or leave it empty
//       await client.save();
//     }
//   }

//   console.log('Clients updated with googleReviewLink');
//   process.exit();
// };

// const createEmailTemplates = async () => {    
  
//     const clients = await Client.find();

//     if (clients.length === 0) {
//         console.log('No clients found!');
//         process.exit();
//     }

//     for (const client of clients) {
//         const template1 = new EmailTemplate({
//         client: client._id,
//         subject: 'We’d Love Your Feedback',
//         message: 'Dear {{customerName}},\n\nWe would greatly appreciate it if you could leave us a review. Please click the link below to share your thoughts:\n{{reviewLink}}',
//         });

//         const template2 = new EmailTemplate({
//         client: client._id,
//         subject: 'Reminder: We’d Love Your Feedback',
//         message: 'Hi {{customerName}},\n\nJust a friendly reminder to leave us a review if you haven’t already. Your feedback means a lot!\n{{reviewLink}}',
//         });

//         await template1.save();
//         await template2.save();
//         console.log(`Email templates added for client: ${client.businessName}`);
//     }

//     console.log('Email templates added for all clients');
//     process.exit();
// };
  

// async function addSmsTemplates() {
//     try {      
//       // Fetch all clients from the database
//       const clients = await Client.find();
  
//       if (clients.length === 0) {
//         console.log('No clients found!');
//         process.exit();
//       }
  
//       for (const client of clients) {
//         // Define two SMS templates for each client
//         const template1 = new SmsTemplate({
//           name: 'We value your feedback!',
//           content: 'Hello {{customerName}},\n\nWe value your feedback! Please take a moment to share your experience with us : \n{{reviewLink}}',
//           client: client._id
//         });
  
//         const template2 = new SmsTemplate({
//           name: 'Reminder: We’d Love Your Feedback',
//           content: 'Hi {{customerName}},\n\nJust a reminder to leave us your feedback if you haven’t already. \n{{reviewLink}} \nYour opinion matters!',
//           client: client._id
//         });
  
//         // Save both templates for the client
//         await template1.save();
//         await template2.save();
//         console.log(`SMS templates added for client: ${client.businessName}`);
//       }
  
//       console.log('SMS templates added for all clients');
//       process.exit();
//     } catch (error) {
//       console.error('Error adding SMS templates:', error);
//       process.exit();
//     }
//   }
  


// Assuming this is the response template model

const reinitializeReviewResponses = async () => {
  try {
    // Fetch the global response template
    const globalTemplate = await ResponseTemplate.findOne();
    if (!globalTemplate) {
      console.error("Global response templates are missing.");
      return;
    }

    // Fetch all clients
    const clients = await Client.find();

    // Update each client
    for (const client of clients) {
      // Clear old responses (optional, but ensures consistency)
      client.reviewResponses.goodReviewResponses = [];
      client.reviewResponses.badReviewResponses = [];

      // Populate new responses from the global template
      client.reviewResponses.goodReviewResponses = globalTemplate.goodReviewResponses;
      client.reviewResponses.badReviewResponses = globalTemplate.badReviewResponses;

      // Save the updated client
      await client.save();
      console.log(`Updated review responses for client: ${client.businessName}`);
    }

    console.log("All clients' review responses have been reinitialized successfully.");
  } catch (error) {
    console.error("Error updating clients' review responses:", error);
  }
};

