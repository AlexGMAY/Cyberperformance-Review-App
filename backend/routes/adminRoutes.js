const express = require('express');
const multer = require('multer');
const { 
    getDashboardMetrics, 
    getActivityFeed, 
    deactivateClient, 
    importClients, 
    activateClient, 
    getClientStats, 
    getAllCustomers,
    getAllClients,
    bulkUploadCustomers,
    getFilteredReviews,
    addAdmin, 
    updateAdmin, 
    deleteAdmin, 
    getAdmins,
    getAllEmployees
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');


// Temporary upload folder
const upload = multer({ dest: 'uploads/' }); 

const router = express.Router();

router.get('/dashboard', getDashboardMetrics);
router.get('/activity-feed', protect, getActivityFeed);

// Admin Routes

// Protect these routes to super admin access only
router.post('/new', protect, addAdmin);
router.put('/:adminId', protect, updateAdmin);
router.delete('/:adminId', protect, deleteAdmin);
router.get('/admins', protect, getAdmins);

// Clients Routes

// Deactivate/Activate Client
router.patch('/:clientId/activate', protect, activateClient);
router.patch('/:clientId/deactivate', protect, deactivateClient);

// Get Client Analytics and Import Clients as excel file
router.get('/:clientId/stats', protect, getClientStats);
// router.post('/clients/import', protect, importClients);

// Customers Routes

// Get All Customers
router.get('/customers', protect, getAllCustomers);
// Get All Customers
router.get('/clients', protect, getAllClients);
// Bulk Upload Customers to a client
router.post('/upload-customers', upload.single('file'), protect, bulkUploadCustomers);

// Reviews Routes

// Get all filtered Reviews
router.get('/reviews', protect, getFilteredReviews);

// Employees Route
router.get("/employees", getAllEmployees);

module.exports = router;