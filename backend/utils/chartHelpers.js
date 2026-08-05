// Converts (labels, values) into the standard Chart.js-compatible shape:
// { labels: [...], datasets: [{ label, data: [...] }] }
const toChartFormat = (labels, data, datasetLabel = 'Dataset') => ({
  labels,
  datasets: [{ label: datasetLabel, data }],
});

// Fills in missing days with count: 0 so the chart has no gaps
const fillDateGaps = (results, days) => {
  const countByDate = new Map(results.map((r) => [r._id, r.count]));
  const output = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10); // "YYYY-MM-DD"
    output.push({ date: key, count: countByDate.get(key) || 0 });
  }

  return output;
};

module.exports = { toChartFormat, fillDateGaps };