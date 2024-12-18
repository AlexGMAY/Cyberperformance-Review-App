const express = require('express');
const router = express.Router();
const {
  updateBusinessInfo,
  changePassword,
  updateNotifications,
  getResponses,
  updateResponses,
  updateReviewLinks,
  updateGeneralSettings
} = require('../controllers/accountSettingsController');
const { protect } = require('../middleware/authMiddleware');

router.put('/business-info', protect, updateBusinessInfo);
router.put('/change-password', protect, changePassword);
router.put('/notifications', protect, updateNotifications);
router.get('/responses', protect, getResponses);
router.put('/responses', protect, updateResponses);
router.put('/review-links', protect, updateReviewLinks);
router.put('/general', protect, updateGeneralSettings);

module.exports = router;
