const asyncHandler = require('../middleware/asyncHandler');
const dashboardService = require('../services/dashboardService');

const getDashboardSummary = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboardSummary();
  res.status(200).json({ success: true, data });
});

module.exports = { getDashboardSummary };