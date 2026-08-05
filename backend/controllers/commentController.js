const asyncHandler = require('../middleware/asyncHandler');
const commentService = require('../services/commentService');

const addComment = asyncHandler(async (req, res) => {
  const comment = await commentService.addComment(req.user._id, req.params.articleId, req.body.content);
  res.status(201).json({ success: true, data: comment });
});

const getComments = asyncHandler(async (req, res) => {
  const result = await commentService.getCommentsForArticle(req.params.articleId, req.query);
  res.status(200).json({ success: true, ...result });
});

const deleteComment = asyncHandler(async (req, res) => {
  await commentService.deleteComment(req.params.commentId, req.user);
  res.status(200).json({ success: true, message: 'Comment deleted' });
});

const likeComment = asyncHandler(async (req, res) => {
  const result = await commentService.toggleLike(req.params.commentId, req.user._id);
  res.status(200).json({
    success: true,
    message: result.liked ? 'Comment liked' : 'Like removed',
    data: result.comment,
  });
});

module.exports = { addComment, getComments, deleteComment, likeComment };