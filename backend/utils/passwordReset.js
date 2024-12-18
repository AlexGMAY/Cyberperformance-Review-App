const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Admin = require('../models/Admin');
const Client = require('../models/client');


// Generate Reset Token
const generateResetToken = () => {
  return crypto.randomBytes(20).toString('hex'); // Secure random token
};

// Find User Across Models
const findUserByEmail = async (email) => {
  // Search Admins first
  let user = await Admin.findOne({ email });
  if (user) return { user, userType: 'Admin' };

  // Search Clients
  user = await Client.findOne({ email });
  if (user) return { user, userType: 'Client' };

  // Search Employees within the Client model
  const clientWithEmployee = await Client.findOne({ 
    'employees.email': email 
  });

  if (clientWithEmployee) {
    // Extract the specific employee from the array
    const employee = clientWithEmployee.employees.find(emp => emp.email === email);
    return { user: employee, parentClient: clientWithEmployee, userType: 'Employee' };
  }

  // If no user is found
  return null;
};

module.exports = {
  generateResetToken,  
  findUserByEmail,
};
