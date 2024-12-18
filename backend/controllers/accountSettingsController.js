const Client = require('../models/client');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Update Business Information
exports.updateBusinessInfo = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.client.id, req.body, { new: true });
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: "Failed to update business information." });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const client = await Client.findById(req.client.id);
    const isMatch = await bcrypt.compare(req.body.oldPassword, client.password);
    if (!isMatch) return res.status(400).json({ error: "Old password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    client.password = await bcrypt.hash(req.body.newPassword, salt);
    await client.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to change password." });
  }
};

// Update Notification Preferences
exports.updateNotifications = async (req, res) => {
  try {
    const { emailPreferences, smsPreferences } = req.body;

    const client = await Client.findById(req.client.id);

    // Update email preferences if provided
    if (emailPreferences) {
      client.emailPreferences = { ...client.emailPreferences, ...emailPreferences };
    }

    // Update SMS preferences if provided
    if (smsPreferences) {
      client.smsPreferences = { ...client.smsPreferences, ...smsPreferences };
    }

    await client.save();
    res.status(200).json({ message: "Notification preferences updated successfully.", client });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification preferences." });
  }
};

// Get Pre-Written Responses
exports.getResponses = async (req, res) => {
  try {
    const client = await Client.findById(req.client.id);
    if (!client) return res.status(404).json({ message: "Client not found." });

    res.status(200).json({ client });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve responses." });
  }
};

// Update Pre-Written Responses
exports.updateResponses = async (req, res) => {
  try {
    const { goodReviewResponses, badReviewResponses } = req.body;
    const client = await Client.findById(req.client.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found." });
    }

    // Update good review responses
    if (goodReviewResponses) {
      client.reviewResponses.goodReviewResponses = goodReviewResponses;
    }

    // Update bad review responses
    if (badReviewResponses) {
      client.reviewResponses.badReviewResponses = badReviewResponses;
    }

    await client.save();
    res.status(200).json({ message: "Pre-written responses updated successfully.", client });
  } catch (error) {
    console.error("Error updating responses:", error); // Log the error
    res.status(500).json({ message: "Failed to update responses." });
  }
};

// Update Review Links
exports.updateReviewLinks = async (req, res) => {
  try {
    const { googleReviewLink, reviewLink } = req.body;
    const client = await Client.findByIdAndUpdate(
      req.client.id,
      { googleReviewLink, reviewLink },
      { new: true }
    );
    res.status(200).json({ message: "Review links updated successfully.", client });
  } catch (error) {
    res.status(500).json({ message: "Failed to update review links." });
  }
};

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Update General Settings with file upload
exports.updateGeneralSettings = async (req, res) => {
  upload.single('profilePicture')(req, res, async (err) => {
    if (err) return res.status(500).json({ message: 'File upload failed.' });

    try {
      const client = await Client.findById(req.client.id);

      if (req.file) client.profilePicture = `/uploads/${req.file.filename}`;
      if (req.body.timeZone) client.timeZone = req.body.timeZone;
      if (req.body.language) client.language = req.body.language;

      await client.save();
      res.status(200).json({ message: 'General settings updated successfully.', client });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update general settings.' });
    }
  });
};