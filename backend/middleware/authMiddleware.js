const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Client = require('../models/client');

// Protect route for Admin and Client
// exports.protect = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       token = req.headers.authorization.split(' ')[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // Check if the user is an Admin or Client
//       if (decoded.role === 'admin') {
//         req.admin = await Admin.findById(decoded.id).select('-password');
//       } else if (decoded.role === 'client') {
//         req.client = await Client.findById(decoded.id).select('-password');
//       }

//       if (!req.admin && !req.client) {
//         return res.status(401).json({ message: 'Not authorized' });
//       }

//       next();
//     } catch (err) {
//       return res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   }

//   if (!token) {
//     return res.status(401).json({ message: 'Not authorized, no token' });
//   }
// };


// Protect route for Admin, Client, and Client Employee
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Determine the user's role and attach the corresponding data to req
      if (decoded.role === 'Super Admin') {
        req.admin = await Admin.findById(decoded.id).select('-password');
        if (!req.admin) {
          return res.status(401).json({ message: 'Admin not authorized' });
        }
      } else if (decoded.role === 'client') {
        req.client = await Client.findById(decoded.id).select('-password');
        if (!req.client) {
          return res.status(401).json({ message: 'Client not authorized' });
        }
      } else if (decoded.role === 'clientEmployee') {
        // Find the employee under the Client model
        const client = await Client.findOne({ 'employees._id': decoded.id });
        if (!client) {
          return res.status(401).json({ message: 'Employee not authorized' });
        }
        req.clientEmployee = client.employees.id(decoded.id); // Attach employee details to req
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

