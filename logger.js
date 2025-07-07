const axios = require('axios');

const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

async function log(stack, level, pkg, message) {
  try {
    await axios.post(LOG_API_URL, {
      stack,
      level,
      package: pkg,
      message,
    });
  } catch (err) {
    // Fail silently as per requirements
  }
}

module.exports = log;