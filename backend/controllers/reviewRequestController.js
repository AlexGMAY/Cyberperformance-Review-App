const Customer = require('../models/customer'); 
const Client = require('../models/client');
const EmailTemplate = require('../models/emailTemplate');
const SmsTemplate = require('../models/smsTemplate'); 
const sendEmail = require('../services/emailService');
const sendSms = require('../services/smsService');
const shortenLink = require('../services/shortenLinkService');

// Controller function to handle sending review request emails
exports.sendReviewRequestEmail = async (req, res) => {
  const clientId = req.client.id; // Extracted from JWT token
  const { customerId, templateId } = req.body;

  try {
    // Retrieve customer and ensure they belong to the authenticated client
    const customer = await Customer.findOne({ _id: customerId, client: clientId });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found or does not belong to this client' });
    }

    // Retrieve email template and ensure it belongs to the authenticated client
    const template = await EmailTemplate.findOne({ _id: templateId, client: clientId });
    if (!template) {
      return res.status(404).json({ error: 'Template not found or does not belong to this client' });
    }

    // Retrieve client (this should always be the authenticated client)
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Construct the review link using the client's specified link or default to generated link
    const reviewLink = client.googleReviewLink 
      ? client.googleReviewLink
      : `${process.env.REVIEW_LINK_BASE_URL}/${client._id}/${customer._id}`;

    const shortenedReviewLink = await shortenLink(reviewLink);  

    // Generate the email message with dynamic placeholders
    const emailMessage = template.message
      .replace('{{reviewLink}}', shortenedReviewLink)
      .replace('{{customerName}}', customer.name);

    // Send the email
    await sendEmail(customer.email, template.subject, emailMessage);
    res.status(200).json({ message: 'Review request sent successfully' });
  } catch (error) {
    console.error('Error sending review request by email:', error);
    res.status(500).json({ error: 'Failed to send review request' });
  }
};

// Controller function to fetch email templates for the authenticated client
exports.getTemplates = async (req, res) => {
  try {
    const clientId = req.client.id; // Assuming `req.client.id` is set by the authentication middleware
    const templates = await EmailTemplate.find({ client: clientId });

    if (!templates || templates.length === 0) {
      return res.status(404).json({ message: 'No templates found for this client' });
    }

    res.status(200).json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to retrieve templates' });
  }
};

// Controller function to fetch customers for the authenticated client
exports.getCustomers = async (req, res) => {
  try {
    const clientId = req.client.id; // Assuming `req.client.id` is set by the authentication middleware
    const customers = await Customer.find({ client: clientId });

    if (!customers || customers.length === 0) {
      return res.status(404).json({ message: 'No customers found for this client' });
    }

    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to retrieve customers' });
  }
};

// Controller function to handle sending review request sms
exports.sendReviewRequestSms = async (req, res) => {

  const clientId = req.client.id; // Extracted from JWT token
  const { customerId, templateId } = req.body;

  try {
    // Retrieve customer and ensure they belong to the authenticated client
    const customer = await Customer.findOne({ _id: customerId, client: clientId });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found or does not belong to this client' });
    }

    // Retrieve SMS template and ensure it belongs to the authenticated client
    const template = await SmsTemplate.findOne({ _id: templateId, client: clientId });
    if (!template) {
      return res.status(404).json({ error: 'Template not found or does not belong to this client' });
    }

    // Retrieve client (this should always be the authenticated client)
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    
    // Construct the review link using the client's specified link or default to generated link
    const reviewLink = client.googleReviewLink 
      ? client.googleReviewLink
      : `${process.env.REVIEW_LINK_BASE_URL}/${client._id}/${customer._id}`;

    const customerPhone = customer.phoneNumber;

    const shortenedReviewLink = await shortenLink(reviewLink);  

    // Generate the SMS message with dynamic placeholders
    const smsMessage = template.content
      .replace('{{reviewLink}}', shortenedReviewLink)
      .replace('{{customerName}}', customer.name);

    // Call the sendSms function
    await sendSms(customerPhone, smsMessage, shortenedReviewLink);

    res.status(200).json({ message: "SMS Review request sent successfully." });
  } catch (error) {
    console.error("Error in sending SMS review request:", error);
    res.status(500).json({ message: "Failed to send SMS review request." });
  }
};


// Create SMS Template
exports.createSmsTemplate = async (req, res) => {
  try {
    const { name, content, client } = req.body;
    const newTemplate = new SmsTemplate({ name, content, client });
    await newTemplate.save();
    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(500).json({ message: 'Error creating SMS template', error });
  }
};

// Get all SMS Templates
exports.getSmsTemplates = async (req, res) => {
  try {
    const clientId = req.client.id; // Assuming `req.client.id` is set by the authentication middleware
    const templates = await SmsTemplate.find({ client: clientId });

    if (!templates || templates.length === 0) {
      return res.status(404).json({ message: 'No templates found for this client' });
    }

    res.status(200).json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to retrieve templates' });
  }
};

// Update SMS Template
exports.updateSmsTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTemplate = await SmsTemplate.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedTemplate);
  } catch (error) {
    res.status(500).json({ message: 'Error updating SMS template', error });
  }
};

// Delete SMS Template
exports.deleteSmsTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    await SmsTemplate.findByIdAndDelete(id);
    res.status(200).json({ message: 'SMS template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting SMS template', error });
  }
};


// Review Requests Single Endpoint
exports.sendReviewRequest = async (req, res) => {
  const clientId = req.client.id; // Extracted from JWT token
  const { customerId, templateId, type, scheduleDate } = req.body;

  try {
    // Retrieve customer and ensure they belong to the authenticated client
    const customer = await Customer.findOne({ _id: customerId, client: clientId });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found or does not belong to this client' });
    }

    // Retrieve the appropriate template (email or SMS) based on the type
    const templateModel = type === 'email' ? EmailTemplate : SmsTemplate;
    const template = await templateModel.findOne({ _id: templateId, client: clientId });
    if (!template) {
      return res.status(404).json({ error: 'Template not found or does not belong to this client' });
    }

    // Use the correct field for the message based on the template type
    const messageContent = type === 'email' ? template.message : template.content;
    if (!messageContent) {
      return res.status(400).json({ error: `Template ${type === 'email' ? 'message' : 'content'} is missing` });
    }

    // Retrieve client details
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Construct the review link
    const reviewLink = client.googleReviewLink 
      ? client.googleReviewLink
      : `${process.env.REVIEW_LINK_BASE_URL}/${client._id}/${customer._id}`;
    const shortenedReviewLink = await shortenLink(reviewLink);

    // Generate the message with dynamic placeholders
    const message = messageContent
      .replace('{{reviewLink}}', shortenedReviewLink)
      .replace('{{customerName}}', customer.name || 'Customer'); // Fallback for customer name

    if (type === 'email') {
      // Send email
      await sendEmail(customer.email, template.subject || 'Review Request', message);
      res.status(200).json({ message: 'Email review request sent successfully' });
    } else if (type === 'sms') {
      // Send or schedule SMS
      if (scheduleDate) {
        await scheduleSms(customer.phoneNumber, message, scheduleDate);
        res.status(200).json({ message: 'SMS review request scheduled successfully' });
      } else {
        await sendSms(customer.phoneNumber, message);
        res.status(200).json({ message: 'SMS review request sent successfully' });
      }
    } else {
      res.status(400).json({ error: 'Invalid request type. Use "email" or "sms".' });
    }
  } catch (error) {
    console.error('Error sending review request:', error);
    res.status(500).json({ error: 'Failed to send review request' });
  }
};


