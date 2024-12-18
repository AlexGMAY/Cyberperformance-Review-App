const express = require('express');
const ErrorLog = require('../models/ErrorLogs');

const router = express.Router();

// Fetch error logs
router.get('/', async (req, res) => {
  try {
    const logs = await ErrorLog.find().sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch error logs.' });
  }
});

// Clear old logs
router.delete('/clear', async (req, res) => {
  try {
    await ErrorLog.deleteMany({});
    res.status(200).json({ message: 'All error logs cleared successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear error logs.' });
  }
});

module.exports = router;
