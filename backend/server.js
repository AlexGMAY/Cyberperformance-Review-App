require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
require('./config/passport');
const authRoutes = require('./routes/authRoutes'); 
const adminRoutes = require('./routes/adminRoutes');  
const clientRoutes = require('./routes/clientRoutes');
const customerRoutes = require('./routes/customerRoutes');
const scheduleReviewRequests = require('./services/scheduler');
const smsStatus = require('./routes/smsStatus');
const responseRoutes = require('./routes/responseRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const reviewResponseRoutes = require('./routes/reviewResponseRoutes'); 
const reviewRequestRoutes = require('./routes/reviewRequestRoutes');
const accountSettingsRoutes = require('./routes/accountSettingsRoutes');
const templateRoutes = require('./routes/templateRoutes');
const configRoutes = require('./routes/configRoutes');
const errorLogsRoutes = require('./routes/errorLogsRoutes');
const cronJobRoutes = require('./routes/cronJobRoutes');
const AdminReviewRequestsRoutes = require('./routes/AdminReviewRequestsRoutes');
const errorLogger = require('./middleware/errorLogger');


const path = require('path');
const multer = require('multer');
const fs = require('fs');


const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));




// PASSPORT

// Session middleware (required for Passport)
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true in production when using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 day session
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

  // Routes

app.use('/api/auth', authRoutes);  // Authentication Route
app.use('/api/admin', adminRoutes);  // Admin Routes
app.use('/api/clients', clientRoutes); // Client Routes
app.use('/api/customers', customerRoutes);// Customer Routes
app.use('/api/reviews', reviewRoutes); // Review Routes
app.use('/api/review-request', reviewRequestRoutes); // Review Request Routes
app.use('/api/admin-review-requests', AdminReviewRequestsRoutes); // Review Request Routes for Admin
app.use('/api/account-settings', accountSettingsRoutes); // Account Setings Routes
app.use('/api/templates', templateRoutes);  // Email and SMS templates
app.use('/api/config', configRoutes);  // Configuration Routes for Email/SMS Settings
app.use('/api/cron-jobs', cronJobRoutes); // Cron Management routes
app.use('/twilio', smsStatus);

app.use('/api/errorlogs', errorLogsRoutes);
// Error logger middleware (should come after routes)
app.use(errorLogger);

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use the response routes
app.use('/api/responses', responseRoutes); 
app.use('/api', reviewResponseRoutes);


  // Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Start the scheduler
  scheduleReviewRequests();
});
