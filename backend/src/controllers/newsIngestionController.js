const asyncHandler = require('../middleware/asyncHandler');
const newsIngestionService = require('../services/newsIngestionService');

const triggerIngestion = asyncHandler(async (req, res) => {
  const summary = await newsIngestionService.runIngestion();
  res.status(200).json({ success: true, message: 'Ingestion complete', data: summary });
});

module.exports = { triggerIngestion };