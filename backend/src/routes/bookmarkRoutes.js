const express = require('express');
const router = express.Router();
const { addBookmark, removeBookmark, getMyBookmarks } = require('../controllers/bookmarkController');
const { validateArticleIdParam } = require('../validators/bookmarkValidator');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // every route below requires a logged-in user — no exceptions

router.get('/', getMyBookmarks);
router.post('/:articleId', validateArticleIdParam, addBookmark);
router.delete('/:articleId', validateArticleIdParam, removeBookmark);

module.exports = router;