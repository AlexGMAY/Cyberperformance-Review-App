const express = require('express');
const {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
  addCustomer,
  getClientMetrics,
  getCustomersByClientId,
  getClientReviews,
  getRecentReviews,
  getReviews,
  ResponseStatistics,
  getClientData,
  saveFollowUpSettings,
  addEmployee, updateEmployee, deleteEmployee, getEmployees
} = require('../controllers/clientController');
const { getResponses, updateResponse } = require('../controllers/responseController');
const { registerClient, clientLogin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/registerClient', registerClient);
router.post('/clientLogin', clientLogin);

// Create a new client
router.post('/create', protect, createClient);

// Get all clients
router.get('/', protect, getClients);

// Get a single client by ID
router.get('/:id', protect, getClientById);

// Unprotected route for public access
router.get('/public/:id', getClientData);

// Update a client
router.put('/:id', protect, updateClient);

// Delete a client
router.delete('/:id', protect, deleteClient);

// Protect these routes to admin access only
router.post('/:clientId/employees/new', protect, addEmployee);
router.put('/:clientId/employees/:employeeId', protect, updateEmployee);
router.delete('/:clientId/employees/:employeeId', protect, deleteEmployee);
router.get('/employees', protect, getEmployees);

// Route to add a customer for a client
router.post('/:clientId/customer', protect, addCustomer);
router.get('/:clientId/customers', protect, getCustomersByClientId);

// Reviews Retrieval
//router.get('/:clientId/reviews', protect, getClientReviews);
router.get('/:clientId/reviews', protect, getReviews);
router.get('/:clientId/recent-reviews', protect, getRecentReviews);

// Get all pre-written responses for a client
router.get('/responses', protect, getResponses);

// Update a specific pre-written response
router.put('/responses/:type/:index', protect, updateResponse); 

// Route to get client-specific metrics
router.get('/:clientId/metrics', protect, getClientMetrics);
// Define the route with client ID parameter
router.get('/reviews/stats/:clientId', protect, ResponseStatistics);

// Route to set email and sms follow-ups
router.post('/follow-up-settings', protect, saveFollowUpSettings);


module.exports = router;

