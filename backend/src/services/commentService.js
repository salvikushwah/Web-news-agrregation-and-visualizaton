const commentRepository = require('../repositories/commentRepository');
const articleRepository = require('../repositories/articleRepository');
const AppError = require('../utils/AppError');

const addComment = async (userId, articleId, content) => {
  const article = await articleRepository.findById(articleId);
  if (!article) throw new AppError('Article not found', 404);

  return commentRepository.create({ user: userId, article: articleId, content });
};

const getCommentsForArticle = async (articleId, { page = 1, limit = 20 }) => {
  const [comments, total] = await Promise.all([
    commentRepository.findByArticle(articleId, { page: Number(page), limit: Number(limit) }),
    commentRepository.countByArticle(articleId),
  ]);

  return {
    comments,
    pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
  };
};

const deleteComment = async (commentId, requestingUser) => {
  const comment = await commentRepository.findById(commentId);
  if (!comment) throw new AppError('Comment not found', 404);

  const isOwner = comment.user.toString() === requestingUser._id.toString();
  const isAdmin = requestingUser.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new AppError('You can only delete your own comments', 403);
  }

  await commentRepository.deleteById(commentId);
};

const toggleLike = async (commentId, userId) => {
  const comment = await commentRepository.findById(commentId);
  if (!comment) throw new AppError('Comment not found', 404);

  const alreadyLiked = comment.likes.some((id) => id.toString() === userId.toString());

  const updated = alreadyLiked
    ? await commentRepository.removeLike(commentId, userId)
    : await commentRepository.addLike(commentId, userId);

  return { comment: updated, liked: !alreadyLiked };
};

module.exports = { addComment, getCommentsForArticle, deleteComment, toggleLike };