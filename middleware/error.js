const createError = require('http-errors');

const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status,
    },
  });
};

module.exports = errorHandler;