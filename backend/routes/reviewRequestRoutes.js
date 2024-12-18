const express = require('express');
const router = express.Router();
const { 
    sendReviewRequestEmail,
    getTemplates, 
    getCustomers, 
    sendReviewRequestSms,
    createSmsTemplate, 
    getSmsTemplates,
    updateSmsTemplate,
    deleteSmsTemplate,
    sendReviewRequest,
} = require('../controllers/reviewRequestController');
const { protect } = require('../middleware/authMiddleware');


// Route to fetch email templates
router.get('/templates', protect, getTemplates);

// Route to fetch customers
router.get('/customers', protect, getCustomers);

// Route for sending review request email
// router.post('/email', protect, sendReviewRequestEmail);
// Route for sending review request sms
// router.post('/sms', protect, sendReviewRequestSms);
router.post('/', protect, sendReviewRequest);

// Route to create an SMS template
router.post('/sms-templates', protect, createSmsTemplate);

// Route to get all SMS templates
router.get('/sms-templates', protect, getSmsTemplates);

// Route to update an SMS template by ID
router.put('/sms-templates/:id', protect, updateSmsTemplate);

// Route to delete an SMS template by ID
router.delete('/sms-templates/:id', protect, deleteSmsTemplate);

module.exports = router;
