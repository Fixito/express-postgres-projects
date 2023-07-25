const { StatusCodes } = require('http-status-codes');

class BadRequestError extends Error {
  constructor(message) {
    // super invoque le constructeur du parent
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

class UnauthenticatedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

class ValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.details = details;
    this.name = 'ValidationError';
  }
}

module.exports = {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
  ValidationError
};
