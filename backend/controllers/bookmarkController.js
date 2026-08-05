const asyncHandler = require('../middleware/asyncHandler');
const bookmarkService = require('../services/bookmarkService');

const addBookmark = asyncHandler(async (req, res) => {
  const bookmark = await bookmarkService.addBookmark(req.user._id, req.params.articleId);
  res.status(201).json({ success: true, message: 'Article bookmarked', data: bookmark });
});

const removeBookmark = asyncHandler(async (req, res) => {
  await bookmarkService.removeBookmark(req.user._id, req.params.articleId);
  res.status(200).json({ success: true, message: 'Bookmark removed' });
});

const getMyBookmarks = asyncHandler(async (req, res) => {
  const result = await bookmarkService.getUserBookmarks(req.user._id, req.query);
  res.status(200).json({ success: true, ...result });
});

module.exports = { addBookmark, removeBookmark, getMyBookmarks };