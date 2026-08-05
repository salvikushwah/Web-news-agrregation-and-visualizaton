const User = require('../models/User');

const findByEmail = (email, withPassword = false) => {
  const query = User.findOne({ email });
  return withPassword ? query.select('+password') : query;
};

const findById = (id) => User.findById(id);

const createUser = (data) => User.create(data);

const updateLastLogin = (id) => User.findByIdAndUpdate(id, { lastLogin: Date.now() });

module.exports = { findByEmail, findById, createUser, updateLastLogin };