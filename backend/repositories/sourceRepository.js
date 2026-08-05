const Source = require('../models/Source');

const findAll = (filter = {}) => Source.find(filter).sort({ name: 1 });
const findById = (id) => Source.findById(id);
const findByApiSourceId = (apiSourceId) => Source.findOne({ apiSourceId });
const create = (data) => Source.create(data);
const updateById = (id, data) => Source.findByIdAndUpdate(id, data, { new: true, runValidators: true });
const deleteById = (id) => Source.findByIdAndDelete(id);
const findByName = (name) => Source.findOne({ name: new RegExp(`^${name}$`, 'i') });
// ...add to the module.exports object
module.exports = { findAll, findById, findByApiSourceId, create, updateById, deleteById, findByName };