const Article = require('../models/Article');
const Category = require('../models/Category');
const Source = require('../models/Source');

const getTotalArticles = () => Article.countDocuments({ isApproved: true });
const getTotalCategories = () => Category.countDocuments({ isActive: true });
const getTotalSources = () => Source.countDocuments({ isActive: true });

const getArticleCountSince = (sinceDate) =>
  Article.countDocuments({ isApproved: true, publishedAt: { $gte: sinceDate } });

const getArticlesPerCategory = () =>
  Article.aggregate([
    { $match: { isApproved: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
    { $unwind: '$category' },
    { $project: { _id: 0, categoryId: '$category._id', name: '$category.name', slug: '$category.slug', count: 1 } },
    { $sort: { count: -1 } },
  ]);

const getArticlesPerSource = () =>
  Article.aggregate([
    { $match: { isApproved: true } },
    { $group: { _id: '$source', count: { $sum: 1 } } },
    { $lookup: { from: 'sources', localField: '_id', foreignField: '_id', as: 'source' } },
    { $unwind: '$source' },
    { $project: { _id: 0, sourceId: '$source._id', name: '$source.name', count: 1 } },
    { $sort: { count: -1 } },
  ]);

const getMostViewed = (limit = 10) =>
  Article.find({ isApproved: true })
    .select('-content')
    .populate('category', 'name slug')
    .populate('source', 'name')
    .sort({ views: -1 })
    .limit(limit);

const getLatest = (limit = 10) =>
  Article.find({ isApproved: true })
    .select('-content')
    .populate('category', 'name slug')
    .populate('source', 'name')
    .sort({ publishedAt: -1 })
    .limit(limit);

const getPopularCategoriesByViews = (limit = 5) =>
  Article.aggregate([
    { $match: { isApproved: true } },
    { $group: { _id: '$category', totalViews: { $sum: '$views' }, articleCount: { $sum: 1 } } },
    { $sort: { totalViews: -1 } },
    { $limit: limit },
    { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
    { $unwind: '$category' },
    { $project: { _id: 0, categoryId: '$category._id', name: '$category.name', slug: '$category.slug', totalViews: 1, articleCount: 1 } },
  ]);

  const getArticlesTimeSeries = (days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (days - 1));
  startDate.setHours(0, 0, 0, 0);

  return Article.aggregate([
    { $match: { isApproved: true, publishedAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$publishedAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

// Add to module.exports

module.exports = {
  getTotalArticles, getTotalCategories, getTotalSources, getArticleCountSince,
  getArticlesPerCategory, getArticlesPerSource, getMostViewed, getLatest, getPopularCategoriesByViews, getArticlesTimeSeries,
};