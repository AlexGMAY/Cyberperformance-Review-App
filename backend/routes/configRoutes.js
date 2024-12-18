const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const { protect } = require('../middleware/authMiddleware');

router.get('/settings', protect, configController.getSettings);
router.post('/settings', protect, configController.updateSetting);

module.exports = router;
