const { StatusCodes } = require('http-status-codes');
// const CustomError = require('../errors/custom-error');

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // définir les valeurs par défaut
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:
      err.message ||
      "Quelque chose s'est mal passé veuillez réessayer plus tard",
  };

  // if (err instanceof CustomError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }

  // Si l'email est dupliqué
  if (err.code && err.code === '23505') {
    customError.msg = `${err.detail} Veuillez choisir une autre valeur`;
    customError.statusCode = 400;
  }

  // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
  res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
