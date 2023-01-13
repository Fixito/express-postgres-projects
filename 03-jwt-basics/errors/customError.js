class CustomError extends Error {
  constructor(message, statusCode) {
    // super invoque le constructeur du parent
    super(message);
    // this.statusCode = statusCode;

    //* faire plus de classes erreurs (à faire en tout dernier) :
    //* créer bad-request.js, unauthenticated.js, index.js
  }
}

module.exports = CustomError;
