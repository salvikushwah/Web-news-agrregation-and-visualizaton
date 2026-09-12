const asyncHandler = require('../middleware/asyncHandler');
const sourceService = require('../services/sourceService');

const getSources = asyncHandler(async (req, res) => {
  const sources = await sourceService.getAllSources();
  res.status(200).json({ success: true, count: sources.length, data: sources });
});

const getSource = asyncHandler(async (req, res) => {
  const source = await sourceService.getSourceById(req.params.id);
  res.status(200).json({ success: true, data: source });
});

const createSource = asyncHandler(async (req, res) => {
  const source = await sourceService.createSource(req.body);
  res.status(201).json({ success: true, data: source });
});

const updateSource = asyncHandler(async (req, res) => {
  const source = await sourceService.updateSource(req.params.id, req.body);
  res.status(200).json({ success: true, data: source });
});

const deleteSource = asyncHandler(async (req, res) => {
  await sourceService.deleteSource(req.params.id);
  res.status(200).json({ success: true, message: 'Source deleted' });
});

module.exports = { getSources, getSource, createSource, updateSource, deleteSource };