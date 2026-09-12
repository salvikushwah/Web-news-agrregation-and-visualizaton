const express = require('express');
const router = express.Router();
const {
  recordView, logReadingTime, getRecentlyViewed, getLastViewed, clearHistory,
} = require('../controllers/readingHistoryController');
const { validateArticleIdParam, validateDurationBody } = require('../validators/readingHistoryValidator');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // same pattern as Bookmarks — everything here requires a logged-in user

router.get('/', getRecentlyViewed);
router.get('/last', getLastViewed);
router.post('/:articleId', validateArticleIdParam, recordView);
router.patch('/:articleId/duration', validateArticleIdParam, validateDurationBody, logReadingTime);
router.delete('/', clearHistory);

module.exports = router;