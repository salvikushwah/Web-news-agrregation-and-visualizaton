const Article = require('../models/Article');

const findByUrl = (url) => Article.findOne({ url });

const findById = (id) =>
  Article.findById(id).populate('category', 'name slug').populate('source', 'name');

const create = (data) => Article.create(data);

const updateById = (id, data) =>
  Article.findByIdAndUpdate(id, data, { new: true, runValidators: true });

const deleteById = (id) => Article.findByIdAndDelete(id);

const incrementViews = (id) => Article.findByIdAndUpdate(id, { $inc: { views: 1 } });

// The core listing query — filter + pagination + sorting + projection all live here
const findWithFilters = ({ filter, page, limit, sortBy, projection }) => {
  const skip = (page - 1) * limit;

  return Article.find(filter, projection)
    .populate('category', 'name slug')
    .populate('source', 'name')
    .sort(sortBy)
    .skip(skip)
    .limit(limit);
};

const countWithFilters = (filter) => Article.countDocuments(filter);
const deleteOlderThan = (cutoffDate, addedBy = 'api') =>
  Article.deleteMany({ publishedAt: { $lt: cutoffDate }, addedBy });
const searchArticles = ({ filter, textQuery, page, limit, sortBy, projection }) => {
  const skip = (page - 1) * limit;
  const mongoFilter = { ...filter };
  if (textQuery) mongoFilter.$text = { $search: textQuery };

  return Article.find(mongoFilter, projection)
    .populate('category', 'name slug')
    .populate('source', 'name')
    .sort(sortBy)
    .skip(skip)
    .limit(limit);
};

const countSearchResults = (filter, textQuery) => {
  const mongoFilter = { ...filter };
  if (textQuery) mongoFilter.$text = { $search: textQuery };
  return Article.countDocuments(mongoFilter);
};

const findNearby = ({ longitude, latitude, radiusKm, limit = 20 }) =>
  Article.find({
    isApproved: true,
    location: {
      $nearSphere: {
        $geometry: { type: 'Point', coordinates: [longitude, latitude] },
        $maxDistance: radiusKm * 1000, // $maxDistance is in METERS, not km
      },
    },
  })
    .select('-content')
    .populate('category', 'name slug')
    .populate('source', 'name')
    .limit(limit);

// Add to module.exports

// Add both to module.exports
// ...add to the module.exports object

module.exports = {
  findByUrl,
  findById,
  create,
  updateById,
  deleteById,
  incrementViews,
  findWithFilters,
  countWithFilters,
  deleteOlderThan,
  searchArticles,
  countSearchResults,
  findNearby,
};