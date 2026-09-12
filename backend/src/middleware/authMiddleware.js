const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const AppError = require('../utils/AppError');
const userRepository = require('../repositories/userRepository');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Not authorized, no token provided', 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await userRepository.findById(decoded.id);
  if (!user) {
    throw new AppError('User belonging to this token no longer exists', 401);
  }

  if (!user.isActive) {
    throw new AppError('This account has been deactivated', 403);
  }

  req.user = user;
  next();
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(`Role '${req.user.role}' is not authorized to access this route`, 403);
    }
    next();
  };
};
const attachUserIfPresent = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepository.findById(decoded.id);
    if (user && user.isActive) req.user = user;
  } catch (err) {
    // Invalid/expired token on a public route — proceed as a guest, don't block the request
  }

  next();
});

// Add to module.exports: { protect, authorize, attachUserIfPresent }

module.exports = { protect, authorize, attachUserIfPresent };