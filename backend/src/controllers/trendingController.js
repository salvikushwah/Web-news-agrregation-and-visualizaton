const asyncHandler = require('../middleware/asyncHandler');
const trendingService = require('../services/trendingService');

const getTrending = asyncHandler(async (req, res) => {
  const data = await trendingService.getTrending();
  res.status(200).json({ success: true, data });
});

module.exports = { getTrending };