const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Admin = require('../models/Admin'); // Import Admin model
const Client = require('../models/client'); // Import Client model

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;

        // Check if the user exists as an Admin
        let user = await Admin.findOne({ googleId });
        if (user) {
          return done(null, user); // If found in Admin, return user
        }

        // Check if the user exists as a Client
        user = await Client.findOne({ googleId });
        if (user) {
          return done(null, user); // If found in Client, return user
        }

        // Check if the user exists as an Employee within any Client
        user = await Client.findOne({ 'employees.googleId': googleId });
        if (user) {
          const employee = user.employees.find(emp => emp.googleId === googleId);
          return done(null, employee); // Return the employee if found
        }

        // If no existing user, create a new record
        // Example: Adding the user as an Admin (adjust logic as needed)
        const newAdmin = new Admin({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
        });
        await newAdmin.save();
        return done(null, newAdmin);
      } catch (err) {
        return done(err, null); // Pass errors to Passport
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, { id: user.id, role: user.role || 'Super Admin' }); // Include role for later
});

// Deserialize user
passport.deserializeUser(async (data, done) => {
  try {
    let user = null;

    if (data.role === 'Super Admin') {
      user = await Admin.findById(data.id);
    } else if (data.role === 'client') {
      user = await Client.findById(data.id);
    } else {
      // If it's an employee, find it within a Client
      const client = await Client.findOne({ 'employees._id': data.id });
      user = client?.employees.id(data.id);
    }

    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
