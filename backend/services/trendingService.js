const analyticsRepository = require('../repositories/analyticsRepository');
const searchHistoryRepository = require('../repositories/searchHistoryRepository');

const getTrending = async () => {
  const [mostViewed, mostSearched, latest, popularCategories] = await Promise.all([
    analyticsRepository.getMostViewed(10),
    searchHistoryRepository.getTopSearches(10),
    analyticsRepository.getLatest(10),
    analyticsRepository.getPopularCategoriesByViews(5),
  ]);

  return { mostViewed, mostSearched, latest, popularCategories };
};

module.exports = { getTrending };