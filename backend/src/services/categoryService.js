const categoryRepository = require('../repositories/categoryRepository');
const AppError = require('../utils/AppError');

const getAllCategories = () => categoryRepository.findAll({ isActive: true });

const getCategoryById = async (id) => {
  const category = await categoryRepository.findById(id);
  if (!category) throw new AppError('Category not found', 404);
  return category;
};

const createCategory = async (data) => {
  const existing = await categoryRepository.findByName(data.name);
  if (existing) throw new AppError('Category already exists', 409);
  return categoryRepository.create(data);
};

const updateCategory = async (id, data) => {
  const category = await categoryRepository.updateById(id, data);
  if (!category) throw new AppError('Category not found', 404);
  return category;
};

const deleteCategory = async (id) => {
  const category = await categoryRepository.deleteById(id);
  if (!category) throw new AppError('Category not found', 404);
  return category;
};

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };