const sourceRepository = require('../repositories/sourceRepository');
const AppError = require('../utils/AppError');

const getAllSources = () => sourceRepository.findAll({ isActive: true });

const getSourceById = async (id) => {
  const source = await sourceRepository.findById(id);
  if (!source) throw new AppError('Source not found', 404);
  return source;
};

const createSource = (data) => sourceRepository.create(data);

const updateSource = async (id, data) => {
  const source = await sourceRepository.updateById(id, data);
  if (!source) throw new AppError('Source not found', 404);
  return source;
};

const deleteSource = async (id) => {
  const source = await sourceRepository.deleteById(id);
  if (!source) throw new AppError('Source not found', 404);
  return source;
};

module.exports = { getAllSources, getSourceById, createSource, updateSource, deleteSource };