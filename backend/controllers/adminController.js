const Client = require('../models/client');
const Review = require('../models/review');
const Customer = require('../models/customer');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const csv = require('csv-parser'); // Use a CSV parsing library like csv-parser
const fs = require('fs');


exports.getDashboardMetrics = async (req, res) => {
  try {
    // Aggregate data
    const totalClients = await Client.countDocuments();
    const activeClients = await Client.countDocuments({ active: true });
    const inactiveClients = await Client.countDocuments({ active: false });
    const totalCustomers = await Customer.countDocuments();
    const totalReviews = await Review.countDocuments();
    const positiveReviews = await Review.countDocuments({ reviewRating: { $gte: 3 } });
    const negativeReviews = await Review.countDocuments({ reviewRating: { $lt: 3 } });

    // Response
    res.status(200).json({
      totalClients, 
      activeClients,
      inactiveClients,
      totalCustomers,   
      totalReviews,
      positiveReviews,
      negativeReviews,
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
};

exports.getActivityFeed = async (req, res) => {
    try {
      const recentCustomers = await Customer.find().sort({ createdAt: -1 }).limit(10).populate('client');
      const recentReviews = await Review.find().sort({ reviewDate: -1 }).limit(10).populate('client customer');
  
      res.status(200).json({ recentCustomers, recentReviews });
    } catch (error) {
      console.error('Error fetching activity feed:', error);
      res.status(500).json({ error: 'Failed to fetch activity feed' });
    }
};

// ADMINS METHODS :

// Create a new admin
exports.addAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const adminExists = await Admin.findOne({ username });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully', admin: { id: newAdmin._id, username: newAdmin.username } });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin', error: error.message });
  }
};

// Update admin details
exports.updateAdmin = async (req, res) => {
  const { adminId } = req.params;
  const { username, password } = req.body;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (username) admin.username = username;
    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }

    await admin.save();
    res.json({ message: 'Admin updated successfully', admin: { id: admin._id, username: admin.username } });
  } catch (error) {
    res.status(500).json({ message: 'Error updating admin', error: error.message });
  }
};

// Delete an admin
exports.deleteAdmin = async (req, res) => {
  const { adminId } = req.params;

  try {
    const admin = await Admin.findByIdAndDelete(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting admin', error: error.message });
  }
};

// Get all admins
exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving admins', error: error.message });
  }
};


// CLIENTS METHODS :

// Get client stats
exports.getClientStats = async (req, res) => {
  const { clientId } = req.params;

  try {
    // Find the client by ID
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Count total customers for the client
    const totalCustomers = await Customer.countDocuments({ client: clientId });

    // Count total reviews for the client's customers
    const totalReviews = await Review.countDocuments({ client: clientId });

    // Respond with the statistics
    res.status(200).json({ totalCustomers, totalReviews });
  } catch (error) {
    console.error('Error fetching client stats:', error);
    res.status(500).json({ error: 'Failed to fetch client stats' });
  }
};

// Admin controller to activate a client
exports.activateClient = async (req, res) => {
  const { clientId } = req.params;  // Extract the clientId from the URL params
  try {
    if (!clientId) {
      return res.status(400).send({ error: 'Client ID is required' });
    }

    const client = await Client.findByIdAndUpdate(clientId, { active: true }, { new: true });
    if (!client) {
      return res.status(404).send({ error: 'Client not found' });
    }

    res.status(200).send(client);
  } catch (error) {
    console.error('Error during client activation:', error);
    res.status(500).send({ error: 'Server error' });
  }
};

// Admin controller to deactivate a client
exports.deactivateClient = async (req, res) => {
  const { clientId } = req.params;  // Extract the clientId from the URL params
  try {
    if (!clientId) {
      return res.status(400).send({ error: 'Client ID is required' });
    }

    const client = await Client.findByIdAndUpdate(clientId, { active: false }, { new: true });
    if (!client) {
      return res.status(404).send({ error: 'Client not found' });
    }

    res.status(200).send(client);
  } catch (error) {
    console.error('Error during client deactivation:', error);
    res.status(500).send({ error: 'Server error' });
  }
};

// CUSTOMERS METHODS :

// Get All Customers

exports.getAllCustomers = async (req, res) => {
  const { clientId, name, email, phone } = req.query;

  try {
    const query = {};
    if (clientId) query.client = clientId;
    if (name) query.name = { $regex: name, $options: 'i' };
    if (email) query.email = { $regex: email, $options: 'i' };
    if (phone) query.phone = { $regex: phone, $options: 'i' };

    const customers = await Customer.find(query).populate('client', 'businessName');
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customers', error: err });
  }
};

// Fetch all clients
exports.getAllClients = async (req, res) => {
  try {
    // Fetch all clients from the database
    const clients = await Client.find().select('-password'); // Exclude sensitive fields like passwords
    res.status(200).json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Error fetching clients', error: error.message });
  }
};

exports.bulkUploadCustomers = async (req, res) => {
  try {
    const { clientId } = req.body;
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const filePath = req.file.path; // File uploaded via middleware
    const customers = [];

    // Read and parse the CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        customers.push({
          name: row.name,
          email: row.email,
          phoneNumber: row.phoneNumber,
          client: clientId,
        });
      })
      .on('end', async () => {
        await Customer.insertMany(customers);
        fs.unlinkSync(filePath); // Clean up uploaded file
        res.status(201).json({ message: 'Customers uploaded successfully' });
      });
  } catch (error) {
    console.error('Error uploading customers:', error);
    res.status(500).json({ message: 'Error uploading customers', error: error.message });
  }
};


// REVIEWS METHODS

// Get All Filtered Reviews
exports.getFilteredReviews = async (req, res) => {
  try {
    // Extract filters from query parameters
    const { client, rating, startDate, endDate, status } = req.query;

    // Build the query object
    let query = {};

    // Filter by client
    if (client) {
      query['review.client'] = client;
    }

    // Filter by rating
    if (rating) {
      query.reviewRating = parseInt(rating);
    }

    // Filter by date range
    if (startDate || endDate) {
      query.reviewDate = {};
      if (startDate) query.reviewDate.$gte = new Date(startDate);
      if (endDate) query.reviewDate.$lte = new Date(endDate);
    }

    // Filter by response status
    if (status === 'Pending') {
      query.response = { $exists: false };
    } else if (status === 'Responded') {
      query.response = { $exists: true };
    }

    // Fetch filtered reviews with customer and client information
    const reviews = await Review.find(query)
      .populate('customer', 'name email phoneNumber client') // Fetch customer details
      .populate('client', 'businessName'); // Fetch client details

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching filtered reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews.' });
  }
};


// EMPLOYEES METHODS

// Fetch all employees with their respective client details
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Client.aggregate([
      { $unwind: "$employees" }, // Flatten employees array
      {
        $lookup: {
          from: "clients", // Collection name
          localField: "_id",
          foreignField: "_id",
          as: "clientDetails",
        },
      },
      {
        $project: {
          "employees.name": 1,
          "employees.email": 1,
          "employees.phone": 1,
          "employees.role": 1,
          "employees._id": 1,
          client: { $arrayElemAt: ["$clientDetails", 0] },
        },
      },
    ]);
    res.status(200).json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
