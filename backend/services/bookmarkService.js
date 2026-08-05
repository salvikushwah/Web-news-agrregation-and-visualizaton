const bookmarkRepository = require('../repositories/bookmarkRepository');
const articleRepository = require('../repositories/articleRepository');
const AppError = require('../utils/AppError');

const addBookmark = async (userId, articleId) => {
  const article = await articleRepository.findById(articleId);
  if (!article) throw new AppError('Article not found', 404);

  const existing = await bookmarkRepository.findOne(userId, articleId);
  if (existing) throw new AppError('Article already bookmarked', 409);

  return bookmarkRepository.create(userId, articleId);
};

const removeBookmark = async (userId, articleId) => {
  const removed = await bookmarkRepository.deleteOne(userId, articleId);
  if (!removed) throw new AppError('Bookmark not found', 404);
  return removed;
};

const getUserBookmarks = async (userId, { page = 1, limit = 10 }) => {
  const [bookmarks, total] = await Promise.all([
    bookmarkRepository.findByUser(userId, { page: Number(page), limit: Number(limit) }),
    bookmarkRepository.countByUser(userId),
  ]);

  return {
    bookmarks,
    pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
  };
};

module.exports = { addBookmark, removeBookmark, getUserBookmarks };