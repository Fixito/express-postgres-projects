const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, _req, res, _next) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const msg =
    err.message || "Une erreur s'est produite, veuillez réessayer plus tard...";

  return res.status(statusCode).json({ msg });
};

module.exports = errorHandlerMiddleware;
