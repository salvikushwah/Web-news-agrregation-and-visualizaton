const asyncHandler = require('../middleware/asyncHandler');
const articleService = require('../services/articleService');

const getArticles = asyncHandler(async (req, res) => {
  const { page, limit, sortBy } = req.query;
  const result = await articleService.getArticles({ page, limit, sortBy });
  res.status(200).json({ success: true, ...result });
});

const getArticle = asyncHandler(async (req, res) => {
  const article = await articleService.getArticleById(req.params.id, { incrementView: true });
  res.status(200).json({ success: true, data: article });
});

const createArticle = asyncHandler(async (req, res) => {
  const article = await articleService.createArticle(req.body);
  res.status(201).json({ success: true, data: article });
});

const updateArticle = asyncHandler(async (req, res) => {
  const article = await articleService.updateArticle(req.params.id, req.body);
  res.status(200).json({ success: true, data: article });
});

const approveArticle = asyncHandler(async (req, res) => {
  const article = await articleService.approveArticle(req.params.id);
  res.status(200).json({ success: true, message: 'Article approved', data: article });
});

const deleteArticle = asyncHandler(async (req, res) => {
  await articleService.deleteArticle(req.params.id);
  res.status(200).json({ success: true, message: 'Article deleted' });
});
const searchArticles = asyncHandler(async (req, res) => {
  const result = await articleService.searchArticles(req.validatedQuery, req.user ? req.user._id : null);
  res.status(200).json({ success: true, ...result });
});

// Add to module.exports

module.exports = { getArticles, getArticle, createArticle, updateArticle, approveArticle, deleteArticle, searchArticles };