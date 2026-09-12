const ReadingHistory = require('../models/ReadingHistory');

const recordView = (userId, articleId) =>
  ReadingHistory.findOneAndUpdate(
    { user: userId, article: articleId },
    { $inc: { viewCount: 1 }, $set: { lastViewedAt: new Date() } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

// Does NOT upsert — logging reading time only makes sense for an article already viewed
const addReadingTime = (userId, articleId, seconds) =>
  ReadingHistory.findOneAndUpdate(
    { user: userId, article: articleId },
    { $inc: { totalReadingTime: seconds } },
    { new: true }
  );

const findRecentByUser = (userId, { page, limit }) => {
  const skip = (page - 1) * limit;
  return ReadingHistory.find({ user: userId })
    .populate({
      path: 'article',
      select: '-content',
      populate: [
        { path: 'category', select: 'name slug' },
        { path: 'source', select: 'name' },
      ],
    })
    .sort({ lastViewedAt: -1 })
    .skip(skip)
    .limit(limit);
};

const countByUser = (userId) => ReadingHistory.countDocuments({ user: userId });

const findLastViewed = (userId) =>
  ReadingHistory.findOne({ user: userId })
    .populate({
      path: 'article',
      select: '-content',
      populate: [
        { path: 'category', select: 'name slug' },
        { path: 'source', select: 'name' },
      ],
    })
    .sort({ lastViewedAt: -1 });

const clearHistory = (userId) => ReadingHistory.deleteMany({ user: userId });

module.exports = { recordView, addReadingTime, findRecentByUser, countByUser, findLastViewed, clearHistory };