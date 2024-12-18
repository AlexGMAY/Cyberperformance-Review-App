 const mongoose = require('mongoose');
 const Client = require('../models/client');
 const Customer = require('../models/customer'); 
 const Review = require('../models/review');


// Create a new client
exports.createClient = async (req, res) => {
  const { businessName, email, password, phoneNumber, reviewLink, googleReviewLink, preferences } = req.body;

  try {
    const clientExists = await Client.findOne({ email });

    if (clientExists) {
      return res.status(400).json({ message: 'Client with this email already exists' });
    }

    const client = new Client({ businessName, email, password, phoneNumber, reviewLink, googleReviewLink, preferences });
    await client.save();

    res.status(201).json({ message: 'Client created successfully', client });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all clients
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get a single client by ID
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate('customers');

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json(client);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get a single client Data by ID
exports.getClientData = async (req, res) => {
  try {
    // Fetch the client by ID and populate the customers field
    const client = await Client.findById(req.params.id).populate('customers');

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Send only the necessary data to the frontend
    const clientData = {
      businessName: client.businessName,
      customers: client.customers.map(customer => ({
        id: customer._id,
        name: customer.name,
      })),
    };

    res.status(200).json(clientData);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const { businessName, email, phoneNumber, reviewLink, googleReviewLink, emailPreferences, smsPreferences } = req.body;

  try {
    const client = await Client.findByIdAndUpdate(
      id,
      {
        businessName,
        email,
        phoneNumber,
        reviewLink,
        googleReviewLink,
        emailPreferences,
        smsPreferences,
      },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({ message: 'Client updated successfully', client });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Delete a client
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the provided ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid client ID' });
    }

    // Find the client by _id
    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Remove the client
    await client.deleteOne(); // Correct method to remove in Mongoose 6+
    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (err) {
    console.error('Error in deleteClient:', err); // Log for debugging
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Function to add a customer for a client
exports.addCustomer = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { name, email, phoneNumber } = req.body;

    // Find the client
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Create a new customer linked to the client
    const newCustomer = new Customer({
      name,
      email,
      phoneNumber,
      client: client._id, // Link the customer to the client
    });

    // Save the customer
    const savedCustomer = await newCustomer.save();

    // Add the customer to the client's customers array
    client.customers.push(savedCustomer._id);
    await client.save();

    res.status(201).json({ message: 'Customer added successfully', customer: savedCustomer });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add a customer', error: error.message });
  }
};


// Get customers for a specific client
exports.getCustomersByClientId = async (req, res) => {
  const { clientId } = req.params;

  try {
    // Fetch customers associated with the clientId
    const customers = await Customer.find({ client: clientId }); // Adjust according to your schema

    if (!customers) {
      return res.status(404).json({ message: 'No customers found for this client.' });
    }

    return res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ------------- Calculating Client Metrics ------------------ //

exports.getClientMetrics = async (req, res) => {
  try {
    const { clientId } = req.params;

    // Fetch the client by ID
    const client = await Client.findById(clientId).populate('customers');

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Initialize metrics
    let emailsSent = 0;
    let smsSent = 0;
    let responsesReceived = 0;

    // Count sent emails and SMS from the client's followUpHistory
    emailsSent = (client.followUpHistory || []).filter(entry => entry.type === 'email').length;
    smsSent = (client.followUpHistory || []).filter(entry => entry.type === 'sms').length;

    // Iterate through each customer to aggregate responses
    for (const customer of client.customers) {
      const customerData = await Customer.findById(customer._id);
      if (customerData) {
        // Count the responses (reviews) from the customer's reviews (assuming there is a review model)
        responsesReceived += (customerData.followUpHistory || []).filter(entry => entry.status === 'received').length; // Adjust this condition as necessary
      }
    }

    // Calculate response rate
    const totalSent = emailsSent + smsSent;
    const responseRate = totalSent ? Math.min(((responsesReceived / totalSent) * 100), 100).toFixed(2) : "0.00";

    // const responseRate = totalSent ? ((responsesReceived / totalSent) * 100).toFixed(2) : "0.00";

    return res.json({
      responseRate,
      emailsSent,
      smsSent,
    });
  } catch (error) {
    console.error('Error fetching client metrics:', error);
    res.status(500).json({ message: 'Error fetching client metrics', error: error.message });
  }
};

// Reviews 
exports.getClientReviews = async (req, res) => {
  const { clientId } = req.params;

  try {
    // Check if the client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Find all reviews related to this client
    const reviews = await Review.find({ customer: { $in: client.customers } })
      .populate('customer', 'name email') // Populate customer info if needed
      .sort({ reviewDate: -1 }); // Optional: sort by latest reviews

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching client reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reviews with filters and sorts 
exports.getReviews = async (req, res) => {
  const { clientId } = req.params;
  const { page = 1, limit = 10, sort = "date", filter = "all" } = req.query;

  try {
    // Vérifiez si le client existe
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Critères de filtre
    // Filter criteria with $and to ensure customer is in client.customers and not null
    const filterCriteria = { 
      $and: [
        { customer: { $in: client.customers } }, 
        { customer: { $ne: null } }
      ]
    };   

    // Filtres supplémentaires
    if (filter === "responded") filterCriteria.response = { $exists: true };
    if (filter === "notResponded") filterCriteria.response = { $exists: false };
    if (filter.startsWith("rating_")) {
      const rating = parseInt(filter.split("_")[1], 10);
      filterCriteria.reviewRating = rating;
    }

    // Critères de tri
    const sortCriteria = {};
    if (sort === "date") sortCriteria.reviewDate = -1; // Tri par date décroissante
    if (sort === "rating") sortCriteria.reviewRating = -1; // Tri par note décroissante
    if (sort === "status") sortCriteria.response = 1; // Tri par statut

    const totalReviews = await Review.countDocuments(filterCriteria);    
    const reviews = await Review.find(filterCriteria)
      .populate({
        path: 'customer',
        select: 'name email',
        match: { _id: { $ne: null } } // Ensure only valid customer records are populated
      }) // Peupler les informations du client      
      .sort(sortCriteria)
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));

      // Filter out reviews with null customers after population (fallback validation)
    const validReviews = reviews.filter(review => review.customer !== null);

    res.json({ reviews: validReviews || [], totalReviews });
  } catch (error) {
    console.error("Error retrieving reviews:", error);
    res.status(500).json({ message: "Failed to retrieve reviews" });
  }
};


exports.getRecentReviews = async (req, res) => {
  const { clientId } = req.params;

  try {
    // Check if the client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Retrieve one recent review per customer, limiting the result to 10 reviews
    // Convert customer IDs to ObjectId
    const customerIds = client.customers.map(cust => new mongoose.Types.ObjectId(cust));

    // Retrieve one recent review per customer, limiting the result to 10 reviews
    const reviews = await Review.aggregate([
      { $match: { customer: { $in: customerIds } } },
      { $sort: { reviewDate: -1 } }, // Sort reviews by latest date
      {
        $group: {
          _id: "$customer",
          latestReview: { $first: "$$ROOT" }, // Get only the latest review for each customer
        },
      },
      {
        $lookup: {
          from: 'customers', // The collection name for customers
          localField: '_id', // _id is the customer ID
          foreignField: '_id',
          as: 'customerInfo',
        },
      },
      { $unwind: "$customerInfo" }, // Unwind to include customer information as an object
      { $limit: 10 } // Limit to 10 reviews
    ]);

    // Format the response
    const formattedReviews = reviews.map(r => ({
      ...r.latestReview,
      customer: r.customerInfo, // Attach the customer info
    }));

    res.status(200).json(formattedReviews);
  } catch (error) {
    console.error('Error fetching client reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to fetch response statistics for a specific client
exports.ResponseStatistics = async (req, res) => {
  try {
    const clientId = req.params.clientId;

    // Fetch all reviews associated with the given client ID
    const reviews = await Review.find({ client: clientId });

    // Calculate the total number of reviews
    const total = reviews.length;

    // Count how many reviews have a response
    const responded = reviews.filter(review => review.response).length;

    // Initialize breakdown object with default counts for each rating
    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    // Populate the breakdown with counts for each rating
    reviews.forEach(review => {
      const rating = review.reviewRating;
      if (rating >= 1 && rating <= 5) {
        breakdown[rating] += 1;
      }
    });

    // Send the stats as a response
    res.status(200).json({
      total,
      responded,
      breakdown
    });
  } catch (error) {
    console.error("Error fetching response statistics:", error);
    res.status(500).json({ message: "Failed to retrieve response statistics" });
  }
};


// Set email and SMS follow-up settings controller 
exports.saveFollowUpSettings = async (req, res) => {
  const clientId = req.client.id; // Assumes client is authenticated, and ID is in the token
  const { emailPreferences, smsPreferences, followUpSchedule } = req.body;

  try {
    // Update the client with follow-up preferences and schedule
    await Client.findByIdAndUpdate(clientId, {
      emailPreferences,
      smsPreferences,
      followUpSchedule, // Includes email and sms schedules
    });
    
    res.status(200).json({ message: 'Follow-up settings updated successfully' });
  } catch (error) {
    console.error('Error updating follow-up settings:', error);
    res.status(500).json({ error: 'Failed to update follow-up settings' });
  }
};


// Update Notification Preferences
exports.updateNotifications = async (req, res) => {
  try {
    const { emailNotifications, smsNotifications, notificationFrequency } = req.body;
    const client = await Client.findByIdAndUpdate(
      req.client.id,
      { notificationPreferences: { emailNotifications, smsNotifications, notificationFrequency } },
      { new: true }
    );
    res.status(200).json({ message: "Notification preferences updated successfully.", client });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification preferences." });
  }
};


// CLIENT EMPLOYEES CRUD OPERATIONS

// Add a new employee to a client
exports.addEmployee = async (req, res) => {
  const { clientId } = req.params; // Client ID from the route
  const { name, email, password } = req.body;

  try {
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Check if email already exists in the employees list
    const emailExists = client.employees.some(emp => emp.email === email);
    if (emailExists) {
      return res.status(400).json({ message: 'Employee email already exists' });
    }

    // Hash password and add new employee
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = {
      name,
      email,
      password: hashedPassword,
      phone
    };

    client.employees.push(newEmployee);
    await client.save();

    res.status(201).json({ message: 'Employee added successfully', employee: newEmployee });
  } catch (error) {
    res.status(500).json({ message: 'Error adding employee', error: error.message });
  }
};

// Update an employee's details
exports.updateEmployee = async (req, res) => {
  const { clientId, employeeId } = req.params;
  const { name, email, password, phone } = req.body;

  try {
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const employee = client.employees.id(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Update employee details
    if (name) employee.name = name;
    if (email) employee.email = email;
    if (password) {
      const bcrypt = require('bcryptjs');
      employee.password = await bcrypt.hash(password, 10);
    }
    if (phone) employee.phone = phone;

    await client.save();
    res.json({ message: 'Employee updated successfully', employee });
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee', error: error.message });
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  const { clientId, employeeId } = req.params;

  try {
    // Find the client and remove the employee from the array
    const client = await Client.findByIdAndUpdate(
      clientId,
      { $pull: { employees: { _id: employeeId } } }, // Remove employee with matching _id
      { new: true } // Return the updated document
    );

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully", client });
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }  
};

// Get all employees of a client
exports.getEmployees = async (req, res) => {
  const { clientId } = req.params;

  try {
    const client = await Client.findById(clientId).select('employees');
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(client.employees);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving employees', error: error.message });
  }
};
