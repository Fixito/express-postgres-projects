class CustomError extends Error {
  constructor(message, statusCode) {
    // super invoque le constructeur du parent
    super(message);
    this.statusCode = statusCode;
  }
}

const createCustomError = (msg, statusCode) => {
  return new CustomError(msg, statusCode);
};

module.exports = { CustomError, createCustomError };
