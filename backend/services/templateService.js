const GlobalTemplate = require('../models/globalTemplate');
const ClientTemplate = require('../models/clientTemplate');

/**
 * Get Template for a Client
 * @param {ObjectId} clientId - ID of the client
 * @param {String} type - 'sms' or 'email'
 * @param {String} name - 'initialRequest' or 'reminder'
 * @param {Object} placeholders - Object containing placeholders to replace
 */
const getTemplate = async (clientId, type, name, placeholders) => {
  try {
    // Check for client-specific template
    const clientTemplate = await ClientTemplate.findOne({ 
      client: clientId, 
      'globalTemplate.name': name, 
      'globalTemplate.type': type 
    }).populate('globalTemplate');

    let template;
    if (clientTemplate) {
      template = {
        subject: clientTemplate.subject || clientTemplate.globalTemplate.subject,
        content: clientTemplate.content,
      };
    } else {
      // Fallback to global template
      template = await GlobalTemplate.findOne({ type, name });
    }

    // Replace placeholders in the template
    if (template) {
      let { subject, content } = template;
      for (const [key, value] of Object.entries(placeholders)) {
        const placeholder = new RegExp(`{{${key}}}`, 'g');
        if (subject) subject = subject.replace(placeholder, value);
        content = content.replace(placeholder, value);
      }
      return { subject, content };
    }

    throw new Error('Template not found');
  } catch (error) {
    console.error('Error fetching template:', error);
    throw error;
  }
};

module.exports = { getTemplate };
