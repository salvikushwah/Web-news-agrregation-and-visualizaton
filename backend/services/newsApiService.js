const axios = require('axios');

const NEWS_API_BASE_URL = 'https://newsapi.org/v2/top-headlines';

const fetchTopHeadlines = async ({ category, country = 'us', pageSize = 20 }) => {
  const response = await axios.get(NEWS_API_BASE_URL, {
    params: { category, country, pageSize, apiKey: process.env.NEWS_API_KEY },
    timeout: 10000,
  });

  return response.data.articles;
};

module.exports = { fetchTopHeadlines };