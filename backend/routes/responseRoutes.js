const express = require('express');
const { getResponses, updateResponse } = require('../controllers/responseController');
const { protect } = require('../middleware/authMiddleware');
const ResponseTemplate = require('../models/ResponseTemplate');  

const router = express.Router();

// Get all response templates
router.get('/reviewResponses', protect, getResponses);

// Update a response template
router.put('/reviewResponses/:type/:index', protect, updateResponse);


// Get global review responses
router.get('/responsetemplates', async (req, res) => {
  try {
    const globalResponses = await ResponseTemplate.findOne();  // Fetch the global responses
    if (!globalResponses) {
      return res.status(404).json({ message: 'Global review responses not found' });
    }
    res.status(200).json(globalResponses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching global review responses', error: err });
  }
});

// Update global review responses (admin only)
router.post('/responsetemplates', async (req, res) => {
  try {
    const { goodReviewResponses, badReviewResponses } = req.body;

    const updatedResponses = await ResponseTemplate.findOneAndUpdate(
      {},
      { goodReviewResponses, badReviewResponses },
      { new: true, upsert: true }
    );

    res.status(200).json(updatedResponses);
  } catch (err) {
    res.status(500).json({ message: 'Error updating global review responses', error: err });
  }
});

router.post('/updateExistingClients', async (req, res) => {
  try {
    const goodResponsesTemplate = await ResponseTemplate.findOne({ type: 'good' });
    const badResponsesTemplate = await ResponseTemplate.findOne({ type: 'bad' });

    if (!goodResponsesTemplate || !badResponsesTemplate) {
      return res.status(400).json({ message: 'Global response templates are missing.' });
    }

    const clients = await Client.find();

    const updates = clients.map(async (client) => {
      if (!client.reviewResponses || !client.reviewResponses.goodReviewResponses || !client.reviewResponses.badReviewResponses) {
        client.reviewResponses = {
          goodReviewResponses: goodResponsesTemplate.content,
          badReviewResponses: badResponsesTemplate.content,
        };
        await client.save();
        return `Updated client: ${client.name}`;
      } else {
        return `Client ${client.name} already has responses. Skipping.`;
      }
    });

    const results = await Promise.all(updates);

    res.status(200).json({ message: 'Clients updated successfully', results });
  } catch (err) {
    console.error('Error updating clients:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
