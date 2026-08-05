const readingHistoryRepository = require('../repositories/readingHistoryRepository');
const articleRepository = require('../repositories/articleRepository');
const AppError = require('../utils/AppError');

const MAX_REASONABLE_SECONDS = 3600; // 1 hour cap per logging call

const recordView = async (userId, articleId) => {
  const article = await articleRepository.findById(articleId);
  if (!article) throw new AppError('Article not found', 404);

  return readingHistoryRepository.recordView(userId, articleId);
};

const logReadingTime = async (userId, articleId, seconds) => {
  const cappedSeconds = Math.min(seconds, MAX_REASONABLE_SECONDS);

  const updated = await readingHistoryRepository.addReadingTime(userId, articleId, cappedSeconds);
  if (!updated) {
    throw new AppError('No reading history found for this article — view it first', 404);
  }

  return updated;
};

const getRecentlyViewed = async (userId, { page = 1, limit = 10 }) => {
  const [history, total] = await Promise.all([
    readingHistoryRepository.findRecentByUser(userId, { page: Number(page), limit: Number(limit) }),
    readingHistoryRepository.countByUser(userId),
  ]);

  return {
    history,
    pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
  };
};

const getLastViewed = async (userId) => {
  const entry = await readingHistoryRepository.findLastViewed(userId);
  if (!entry) throw new AppError('No reading history yet', 404);
  return entry;
};

const clearHistory = (userId) => readingHistoryRepository.clearHistory(userId);

module.exports = { recordView, logReadingTime, getRecentlyViewed, getLastViewed, clearHistory };