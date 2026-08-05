const Comment = require('../models/Comment');

const create = (data) => Comment.create(data);

const findById = (id) => Comment.findById(id);

const findByArticle = (articleId, { page, limit }) => {
  const skip = (page - 1) * limit;
  return Comment.find({ article: articleId })
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

const countByArticle = (articleId) => Comment.countDocuments({ article: articleId });

const deleteById = (id) => Comment.findByIdAndDelete(id);

const addLike = (commentId, userId) =>
  Comment.findByIdAndUpdate(commentId, { $addToSet: { likes: userId } }, { new: true });

const removeLike = (commentId, userId) =>
  Comment.findByIdAndUpdate(commentId, { $pull: { likes: userId } }, { new: true });

module.exports = { create, findById, findByArticle, countByArticle, deleteById, addLike, removeLike };