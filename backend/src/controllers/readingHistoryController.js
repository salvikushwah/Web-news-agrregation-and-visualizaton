const asyncHandler = require('../middleware/asyncHandler');
const readingHistoryService = require('../services/readingHistoryService');

const recordView = asyncHandler(async (req, res) => {
  const entry = await readingHistoryService.recordView(req.user._id, req.params.articleId);
  res.status(200).json({ success: true, data: entry });
});

const logReadingTime = asyncHandler(async (req, res) => {
  const entry = await readingHistoryService.logReadingTime(req.user._id, req.params.articleId, req.body.seconds);
  res.status(200).json({ success: true, data: entry });
});

const getRecentlyViewed = asyncHandler(async (req, res) => {
  const result = await readingHistoryService.getRecentlyViewed(req.user._id, req.query);
  res.status(200).json({ success: true, ...result });
});

const getLastViewed = asyncHandler(async (req, res) => {
  const entry = await readingHistoryService.getLastViewed(req.user._id);
  res.status(200).json({ success: true, data: entry });
});

const clearHistory = asyncHandler(async (req, res) => {
  await readingHistoryService.clearHistory(req.user._id);
  res.status(200).json({ success: true, message: 'Reading history cleared' });
});

module.exports = { recordView, logReadingTime, getRecentlyViewed, getLastViewed, clearHistory };