const analyticsRepository = require('../repositories/analyticsRepository');
const searchHistoryRepository = require('../repositories/searchHistoryRepository');
const { startOfToday, daysAgo } = require('../utils/dateHelpers');

const getDashboardSummary = async () => {
  const [
    totalArticles, totalCategories, totalSources,
    todayCount, weeklyCount, monthlyCount,
    articlesPerCategory, articlesPerSource, trendingTopics,
  ] = await Promise.all([
    analyticsRepository.getTotalArticles(),
    analyticsRepository.getTotalCategories(),
    analyticsRepository.getTotalSources(),
    analyticsRepository.getArticleCountSince(startOfToday()),
    analyticsRepository.getArticleCountSince(daysAgo(7)),
    analyticsRepository.getArticleCountSince(daysAgo(30)),
    analyticsRepository.getArticlesPerCategory(),
    analyticsRepository.getArticlesPerSource(),
    searchHistoryRepository.getTopSearches(5),
  ]);

  return {
    totals: { articles: totalArticles, categories: totalCategories, sources: totalSources },
    news: { today: todayCount, weekly: weeklyCount, monthly: monthlyCount },
    articlesPerCategory,
    articlesPerSource,
    trendingTopics,
  };
};

module.exports = { getDashboardSummary };