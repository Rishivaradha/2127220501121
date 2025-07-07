const log = require('./logger');

function loggingMiddleware(req, res, next) {
  log(
    "backend",
    "info",
    "route",
    `Incoming ${req.method} request to ${req.originalUrl}`
  );
  next();
}

module.exports = loggingMiddleware;