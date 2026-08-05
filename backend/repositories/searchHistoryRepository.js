const SearchHistory = require('../models/SearchHistory');

const logSearch = (data) => SearchHistory.create(data);

// Reused later in the Dashboard/Trending step for "Most Searched" topics
const getTopSearches = (limit = 10) =>
  SearchHistory.aggregate([
    { $group: { _id: '$query', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]);

module.exports = { logSearch, getTopSearches };