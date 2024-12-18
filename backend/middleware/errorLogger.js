const ErrorLog = require('../models/ErrorLogs');

const errorLogger = async (err, req, res, next) => {
  console.error('Error caught:', err.message);

  // Log error in database
  await ErrorLog.create({
    serviceName: req.path || 'Unknown Service',
    errorMessage: err.message,
    stackTrace: err.stack,
  });

  res.status(500).json({ message: 'An internal error occurred.', error: err.message });
};

module.exports = errorLogger;
