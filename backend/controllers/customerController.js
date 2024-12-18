const Customer = require('../models/customer');

// Fetch a customer and their reviews
exports.getCustomerWithReviews = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId).populate('reviews');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error });
  }
};

// Fetch all customers for a specific client
exports.getCustomersByClientId = async (req, res) => {
  try {
    const customers = await Customer.find({ client: req.params.clientId }).populate('reviews');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Customer
exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(updatedCustomer);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete Customer
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(204).send(); // No Content
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a customer’s follow-up history
exports.updateFollowUpHistory = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { type, date, status } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.followUpHistory.push({ type, date, status });
    await customer.save();

    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


