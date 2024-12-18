const express = require('express');
const passport = require('passport');
const { 
  registerAdmin, 
  loginAdmin, 
  registerClient, 
  clientLogin, 
  registerEmployee, 
  employeeLogin, 
  forgotPassword,
  resetPassword,  
 } = require('../controllers/authController');
const rateLimit = require('express-rate-limit');


const router = express.Router();

// Register new admin (this should be used carefully)
router.post('/register', registerAdmin);

// Login existing admin
router.post('/login', loginAdmin);

// Register new client (this should be used carefully)
router.post('/registerClient', registerClient);

// Login existing Client
router.post('/clientLogin', clientLogin);

// Employee routes
router.post('/registerEmployee', registerEmployee);
router.post('/employeeLogin', employeeLogin);

// Route to initiate Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // On successful login, redirect to your frontend or dashboard
  res.redirect('http://localhost:3000/dashboard');
});

// Forgot Password Route
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many password reset attempts, please try again later.',
});

router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
