const asyncHandler = require('../middleware/asyncHandler');
const geoService = require('../services/geoService');

const getNearbyArticles = asyncHandler(async (req, res) => {
  const { lat, lng, radiusKm, limit } = req.validatedQuery;
  const articles = await geoService.getNearbyArticles({ lat, lng, radiusKm, limit });
  res.status(200).json({ success: true, count: articles.length, data: articles });
});

module.exports = { getNearbyArticles };