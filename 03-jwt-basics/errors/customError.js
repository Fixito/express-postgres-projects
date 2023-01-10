class CustomError extends Error {
  constructor(message, statusCode) {
    // super invoque le constructeur du parent
    super(message);
    this.statusCode = statusCode;

    //* plus de classes erreurs (à faire en tout dernier)
    // TODO: créer bad-request.js, unauthenticated.js, index.js
  }
}

module.exports = CustomError;
