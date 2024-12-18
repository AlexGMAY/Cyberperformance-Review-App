const express = require('express');
const { 
    getCustomerWithReviews, 
    getCustomersByClientId,
    addCustomer,
    updateFollowUpHistory,
    updateCustomer,
    deleteCustomer,
 } = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to get a customer along with their reviews
router.get('/:customerId/reviews', protect, getCustomerWithReviews);

// Fetch all customers for a specific client
router.get('/:clientId', protect, getCustomersByClientId);

// Add a new customer
// router.post('/', protect, addCustomer);

router.put('/:id', protect, updateCustomer); // Update Customer
router.delete('/:id', protect, deleteCustomer); // Delete Customer


// Update a customer’s follow-up history
router.patch('/:customerId/follow-up', protect, updateFollowUpHistory);



// GET /api/customers/:clientId
router.get('/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;

    // Validate clientId
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ success: false, message: 'Invalid Client ID format' });
    }

    // Fetch customers associated with the client ID
    const customers = await Customer.find({ client: mongoose.Types.ObjectId(clientId) }, 'name'); // Fetch only necessary fields

    if (!customers || customers.length === 0) {
      return res.status(404).json({ success: false, message: 'No customers found for this client ID' });
    }

    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
