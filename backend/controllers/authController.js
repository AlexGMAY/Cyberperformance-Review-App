require('dotenv').config();
const Admin = require('../models/Admin');
const Client = require('../models/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {
  generateResetToken,  
  findUserByEmail,
} = require('../utils/passwordReset');
const { sendPasswordResetEmail } = require("../services/resetPasswordMailService");

// Generate JWT Token with role
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register new admin (for testing, disable this in production)
exports.registerAdmin = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const adminExists = await Admin.findOne({ username });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = new Admin({ username, email, password, role });
    await admin.save();

    res.status(201).json({
      message: 'Admin registered',
      admin: { id: admin._id, username: admin.username },
      token: generateToken(admin._id)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin login
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token with role included
    const token = generateToken(admin._id, 'Super Admin'); // Pass the role as well

    res.json({
      message: 'Logged in successfully',
      admin: { id: admin._id, username: admin.username },
      token: token
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Client login and JWT generation
exports.clientLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if client exists
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: client._id, role: 'client' },  // Include client ID and role
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    // Set the cookie with the JWT
    res.cookie('authToken', token, {
      httpOnly: true, // Prevents client-side scripts from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Ensures cookies are sent over HTTPS in production
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
      sameSite: 'strict' // Protect against CSRF
    });

    res.json({ token, clientId: client._id });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};

exports.registerClient = async (req, res) => {
  const { email, password, businessName, phoneNumber, reviewLink } = req.body;

  // Validate request body
  if (!email || !password || !businessName) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    // Check if client already exists
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ message: 'Client already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new client
    const client = new Client({
      email,
      password: hashedPassword,
      businessName,
      phoneNumber: phoneNumber || 'defaultPhoneNumber',  // Use a default value if not provided
      reviewLink: reviewLink || 'defaultReviewLink'  // Use a default value if not provided
    });

    await client.save();

    // Create JWT token
    const token = jwt.sign(
      { id: client._id, role: 'client' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({ token, clientId: client._id });
  } catch (error) {
    console.error('Registration error:', error); // Log the error for debugging
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Register new Employee
exports.registerEmployee = async (req, res) => {
  const { clientId, email, password, name, phone } = req.body;

  if (!clientId || !email || !password || !name) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Check if employee email is already registered
    const existingEmployee = client.employees.find(emp => emp.email === email);
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee already exists under this client' });
    }

    // Hash the employee password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Add employee to client's employees array
    const newEmployee = { name, email, password: hashedPassword, phone};
    client.employees.push(newEmployee);
    await client.save();

    res.status(201).json({ message: 'Employee registered successfully', employee: { name, email } });
  } catch (error) {
    console.error('Error registering employee:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.employeeLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Search through all clients for the employee
    const client = await Client.findOne({ 'employees.email': email });
    if (!client) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Find the specific employee
    const employee = client.employees.find(emp => emp.email === email);
    if (!employee) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(employee._id, 'clientEmployee');
    // Set the cookie with the JWT
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'strict'
    });

    res.json({message: 'Logged in successfully', employeeId: employee._id, name: employee.name, token });
  } catch (error) {
    console.error('Error logging in employee:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// RESET PASSWORD FOR ALL

/**
 * Forgot Password Controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }

  try {
    const result = await findUserByEmail(email);
    if (!result) {
      return res.status(404).json({ message: 'User with this email not found.' });
    }

    const { user, userType, parentClient } = result;

    // Generate reset token and save hashed version
    const resetToken = generateResetToken();
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry

    if (userType === 'Employee') {
      await parentClient.save();
    } else {
      await user.save();
    }

     // Generate the reset URL
     const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;

     // Log the reset URL for debugging
     console.log(`Password reset link (for testing): ${resetUrl}`);

    // Attempt to send reset email
    try {
      await sendPasswordResetEmail(email, resetToken);
      return res.status(200).json({
        message: 'Password reset link has been sent to your email address.',
      });
    } catch (emailError) {
      console.error(`Error sending reset email to: ${email}`, emailError);
      return res
        .status(500)
        .json({ message: 'Error sending reset email. Please try again later.' });
    }
  } catch (error) {
    console.error(`Forgot Password Error for email: ${email}`, error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

/**
 * Reset Password Controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;

  if (!email || !newPassword || newPassword.length < 8) {
    return res.status(400).json({ message: 'Invalid input. Ensure all fields are provided and password is at least 8 characters.' });
  }

  try {
    const result = await findUserByEmail(email);
    if (!result) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { user, userType, parentClient } = result;

    // Verify token and expiration
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    if (user.resetPasswordToken !== hashedToken || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save the updated user
    if (userType === 'Employee') {
      await parentClient.save();
    } else {
      await user.save();
    }

    res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error(`Reset Password Error: ${error}`);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// exports.initiateGoogleOAuth = (req, res) => {
//   const redirectUri = 'http://localhost:5520/api/auth/google/callback'; // Ensure this matches your Google Cloud Console
//   const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=openid email profile`;

//   // Redirect the user to Google's OAuth page
//   res.redirect(googleAuthUrl);
// };

// Google OAuth Callback

// exports.googleOAuthCallback = async (req, res) => {
//   const { code } = req.query;

//   try {
//     // Exchange authorization code for access token
//     const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
//       code,
//       client_id: process.env.GOOGLE_CLIENT_ID,
//       client_secret: process.env.GOOGLE_CLIENT_SECRET,
//       redirect_uri: 'http://localhost:5520/api/auth/google/callback',
//       grant_type: 'authorization_code',
//     });

//     const { access_token, id_token } = tokenResponse.data;

//     // Use access token or id token to fetch user profile if needed
//     const userResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
//       headers: { Authorization: `Bearer ${access_token}` },
//     });

//     const user = userResponse.data;

//     // Handle the authenticated user (e.g., create or log them in)
//     console.log('User Info:', user);

//     // Redirect the user to your frontend (e.g., dashboard)
//     res.redirect(`http://localhost:3000/dashboard?email=${user.email}`);
//   } catch (err) {
//     console.error('Google OAuth Callback Error:', err.message);
//     res.status(500).send('Authentication failed.');
//   }
// };

