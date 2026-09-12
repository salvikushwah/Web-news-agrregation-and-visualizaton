const express = require('express');
const router = express.Router();
const { addComment, getComments, deleteComment, likeComment } = require('../controllers/commentController');
const {
  validateCreateComment, validateArticleIdParam, validateCommentIdParam,
} = require('../validators/commentValidator');
const { protect } = require('../middleware/authMiddleware');

// Reading comments is public — no login needed to see what others said
router.get('/article/:articleId', validateArticleIdParam, getComments);

// Everything else requires a logged-in user
router.post('/article/:articleId', protect, validateArticleIdParam, validateCreateComment, addComment);
router.delete('/:commentId', protect, validateCommentIdParam, deleteComment);
router.patch('/:commentId/like', protect, validateCommentIdParam, likeComment);

module.exports = router;