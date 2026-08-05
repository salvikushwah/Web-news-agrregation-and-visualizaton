const express = require('express');
const router = express.Router();
const {
  getArticles, getArticle, createArticle, updateArticle, approveArticle, deleteArticle, searchArticles,
} = require('../controllers/articleController');
const { validateCreateArticle, validateUpdateArticle } = require('../validators/articleValidator');
const { validateSearchQuery } = require('../validators/searchValidator');
const { protect, authorize, attachUserIfPresent } = require('../middleware/authMiddleware');

// Static route MUST come before the dynamic /:id route
router.get('/search', attachUserIfPresent, validateSearchQuery, searchArticles);

router.get('/', getArticles);
router.get('/:id', getArticle);

router.post('/', protect, authorize('admin'), validateCreateArticle, createArticle);
router.put('/:id', protect, authorize('admin'), validateUpdateArticle, updateArticle);
router.patch('/:id/approve', protect, authorize('admin'), approveArticle);
router.delete('/:id', protect, authorize('admin'), deleteArticle);

module.exports = router;