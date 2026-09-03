const Source = require('../models/Source');

const findAll = (filter = {}) =>
  Source.find(filter).sort({ name: 1 });

const findById = (id) =>
  Source.findById(id);

const findByApiSourceId = (apiSourceId) =>
  Source.findOne({ apiSourceId });

const findByName = (name) =>
  Source.findOne({
    name: new RegExp(`^${name}$`, 'i'),
  });

const create = (data) =>
  Source.create(data);

const findOrCreate = async (data) => {
  const existing = await findByName(data.name);

  if (existing) {
    return existing;
  }

  try {
    return await Source.create(data);
  } catch (err) {
    // Another ingestion request may have created it
    // between findByName() and create().
    if (err.code === 11000) {
      const existingAfterDuplicate = await findByName(data.name);

      if (existingAfterDuplicate) {
        return existingAfterDuplicate;
      }
    }

    throw err;
  }
};

const updateById = (id, data) =>
  Source.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

const deleteById = (id) =>
  Source.findByIdAndDelete(id);

module.exports = {
  findAll,
  findById,
  findByApiSourceId,
  findByName,
  findOrCreate,
  create,
  updateById,
  deleteById,
};