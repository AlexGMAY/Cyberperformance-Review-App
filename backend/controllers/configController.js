const Config = require('../models/config');


// Helper function to get default values from .env
const getEnvDefault = (serviceName) => {
    switch (serviceName) {
      case 'Twilio':
        return process.env.TWILIO_AUTH_TOKEN || null;
      case 'Postmark':
        return process.env.POSTMARK_API_KEY || null;
      case 'Google API':
        return {
          clientId: process.env.GOOGLE_CLIENT_ID || null,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET || null,
        };
      default:
        return null;
    }
};
  
  
// Get all service settings
exports.getSettings = async (req, res) => {
    try {
      let settings = await Config.find();
  
      const services = ['Twilio', 'Postmark', 'Google API'];
      services.forEach((service) => {
        if (!settings.find((s) => s.serviceName === service)) {
          settings.push({
            serviceName: service,
            apiKey: getEnvDefault(service),
            updatedAt: null, // Indicates default value from .env
          });
        }
      });
  
      res.status(200).json({ settings });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch settings', error });
    }
};
  

// Update or create service settings
exports.updateSetting = async (req, res) => {
  try {
    const { serviceName, apiKey } = req.body;
    const setting = await Config.findOneAndUpdate(
      { serviceName },
      { apiKey, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: 'Setting updated successfully', setting });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update setting', error });
  }
};
