const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

const extractEvent = async ({ title, content }) => {
  const response = await axios.post(
    `${AI_SERVICE_URL}/extract-event`,
    {
      title,
      content,
    },
    {
      timeout: 120000,
    }
  );

  return response.data;
};

module.exports = {
  extractEvent,
};