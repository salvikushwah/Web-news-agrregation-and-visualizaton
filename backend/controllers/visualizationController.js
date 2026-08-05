const asyncHandler = require('../middleware/asyncHandler');
const visualizationService = require('../services/visualizationService');

const clampDays = (value) => Math.min(Math.max(Number(value) || 30, 1), 90);

const getPieChart = asyncHandler(async (req, res) => {
  const data = await visualizationService.getCategoryPieChart();
  res.status(200).json({ success: true, chartType: 'pie', data });
});

const getBarChart = asyncHandler(async (req, res) => {
  const data = await visualizationService.getSourceBarChart();
  res.status(200).json({ success: true, chartType: 'bar', data });
});

const getLineChart = asyncHandler(async (req, res) => {
  const days = clampDays(req.query.days);
  const data = await visualizationService.getArticlesLineChart(days);
  res.status(200).json({ success: true, chartType: 'line', data });
});

const getAreaChart = asyncHandler(async (req, res) => {
  const days = clampDays(req.query.days);
  const data = await visualizationService.getCumulativeAreaChart(days);
  res.status(200).json({ success: true, chartType: 'area', data });
});

module.exports = { getPieChart, getBarChart, getLineChart, getAreaChart };