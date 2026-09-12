const Bookmark = require('../models/Bookmark');

const findOne = (userId, articleId) => Bookmark.findOne({ user: userId, article: articleId });

const create = (userId, articleId) => Bookmark.create({ user: userId, article: articleId });

const deleteOne = (userId, articleId) => Bookmark.findOneAndDelete({ user: userId, article: articleId });

const findByUser = (userId, { page, limit }) => {
  const skip = (page - 1) * limit;
  return Bookmark.find({ user: userId })
    .populate({
      path: 'article',
      select: '-content',
      populate: [
        { path: 'category', select: 'name slug' },
        { path: 'source', select: 'name' },
      ],
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

const countByUser = (userId) => Bookmark.countDocuments({ user: userId });

module.exports = { findOne, create, deleteOne, findByUser, countByUser };