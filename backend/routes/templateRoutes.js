const express = require('express');
const router = express.Router();
const GlobalTemplate = require('../models/globalTemplate');
const ClientTemplate = require('../models/clientTemplate');

// Create a Global Template
router.post('/global', async (req, res) => {
  const { type, name, subject, content } = req.body;

  try {
    const newTemplate = new GlobalTemplate({ type, name, subject, content });
    await newTemplate.save();
    res.status(201).json(newTemplate);
  } catch (error) {
    console.error('Error creating global template:', error); // Log detailed error
    res.status(500).json({ error: 'Error creating global template', details: error.message });
  }
});

// Get All Global Templates
router.get('/global', async (req, res) => {
  try {
    const templates = await GlobalTemplate.find();
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching global templates' });
  }
});

// Update a Global Template
router.put('/global/:id', async (req, res) => {
  const { id } = req.params;
  const { subject, content } = req.body;

  try {
    const updatedTemplate = await GlobalTemplate.findByIdAndUpdate(
      id, 
      { subject, content },
      { new: true }
    );
    res.status(200).json(updatedTemplate);
  } catch (error) {
    res.status(500).json({ error: 'Error updating global template' });
  }
});

// Delete a Global Template
router.delete('/global/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await GlobalTemplate.findByIdAndDelete(id);
    res.status(200).json({ message: 'Global template deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting global template' });
  }
});

// CLIENT-SPECIFIC TEMPLATES ROUTES

// Create/Update Client Template
router.post('/client', async (req, res) => {
    const { clientId, globalTemplateId, subject, content } = req.body;
  
    try {
      const clientTemplate = await ClientTemplate.findOneAndUpdate(
        { client: clientId, globalTemplate: globalTemplateId },
        { subject, content },
        { new: true, upsert: true }
      );
      res.status(200).json(clientTemplate);
    } catch (error) {
      res.status(500).json({ error: 'Error creating/updating client template' });
    }
});
  
// Get All Templates for a Client
router.get('/client/:clientId', async (req, res) => {
    const { clientId } = req.params;
  
    try {
      const templates = await ClientTemplate.find({ client: clientId }).populate('globalTemplate');
      res.status(200).json(templates);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching client templates' });
    }
});
  
// Delete a Client Template
router.delete('/client/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await ClientTemplate.findByIdAndDelete(id);
      res.status(200).json({ message: 'Client template deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting client template' });
    }
});

module.exports = router;
