const Category = require('../models/Category');

const findAll = (filter = {}) => Category.find(filter).sort({ name: 1 });
const findById = (id) => Category.findById(id);
const findByName = (name) => Category.findOne({ name: new RegExp(`^${name}$`, 'i') });
const create = (data) => Category.create(data);
const updateById = (id, data) => Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
const deleteById = (id) => Category.findByIdAndDelete(id);
const findBySlug = (slug) => Category.findOne({ slug });
module.exports = { findAll, findById, findByName, create, updateById, deleteById, findBySlug };