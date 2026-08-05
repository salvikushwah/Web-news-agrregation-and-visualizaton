class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // marks this as a "known" error, not a crash bug
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;