const userRepository = require('../repositories/userRepository');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/AppError');

const register = async ({ name, email, password }) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new AppError('Email is already registered', 409);
  }

  const user = await userRepository.createUser({ name, email, password });
  const token = generateToken(user._id, user.role);

  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email, true);
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('This account has been deactivated', 403);
  }

  await userRepository.updateLastLogin(user._id);
  const token = generateToken(user._id, user.role);

  return { user, token };
};

module.exports = { register, login };