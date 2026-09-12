const analyticsRepository = require('../repositories/analyticsRepository');
const { toChartFormat, fillDateGaps } = require('../utils/chartHelpers');

const getCategoryPieChart = async () => {
  const data = await analyticsRepository.getArticlesPerCategory();
  return toChartFormat(data.map((d) => d.name), data.map((d) => d.count), 'Articles by Category');
};

const getSourceBarChart = async () => {
  const data = await analyticsRepository.getArticlesPerSource();
  const top = data.slice(0, 10); // top 10 sources — a bar chart with 40+ bars isn't readable
  return toChartFormat(top.map((d) => d.name), top.map((d) => d.count), 'Articles by Source');
};

const getArticlesLineChart = async (days) => {
  const raw = await analyticsRepository.getArticlesTimeSeries(days);
  const filled = fillDateGaps(raw, days);
  return toChartFormat(filled.map((d) => d.date), filled.map((d) => d.count), 'Articles Published');
};

const getCumulativeAreaChart = async (days) => {
  const raw = await analyticsRepository.getArticlesTimeSeries(days);
  const filled = fillDateGaps(raw, days);

  let running = 0;
  const cumulative = filled.map((d) => {
    running += d.count;
    return running;
  });

  return toChartFormat(filled.map((d) => d.date), cumulative, 'Cumulative Articles');
};

module.exports = { getCategoryPieChart, getSourceBarChart, getArticlesLineChart, getCumulativeAreaChart };