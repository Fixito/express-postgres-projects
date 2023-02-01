const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, _req, res, _next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:
      err.message ||
      "Quelque chose s'est mal passé veuillez réessayer plus tard"
  };

  // Si l'email est dupliqué
  if (err.code && err.code === '23505') {
    customError.msg = `Email déjà existant`;
    customError.statusCode = 400;
  }

  res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
