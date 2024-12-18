const express = require('express');
const { listCronJobs, startCronJob, stopCronJob } = require('../utils/cronJobRegistry');

const router = express.Router();

// List all cron jobs
router.get('/', (req, res) => {
  try {
    const jobs = listCronJobs();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cron jobs.' });
  }
});

// Start a cron job
router.post('/start/:name', (req, res) => {
  const { name } = req.params;
  if (startCronJob(name)) {
    res.json({ message: `Cron job '${name}' started successfully.` });
  } else {
    res.status(404).json({ message: `Cron job '${name}' not found.` });
  }
});

// Stop a cron job
router.post('/stop/:name', (req, res) => {
  const { name } = req.params;
  if (stopCronJob(name)) {
    res.json({ message: `Cron job '${name}' stopped successfully.` });
  } else {
    res.status(404).json({ message: `Cron job '${name}' not found.` });
  }
});

module.exports = router;
