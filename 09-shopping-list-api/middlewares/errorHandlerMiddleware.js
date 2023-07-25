const { StatusCodes } = require('http-status-codes');
const { translations } = require('../utils/');

const errorHandler = (err, _req, res, _next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:
      err.message || "Une erreur s'est produite, veuillez réessayer plus tard."
  };

  // si erreur de validation
  if (err.name === 'ValidationError') {
    const errors = err.details.map((err) => {
      console.log(err.context);
      const translatedLabel = translations[err.context.label];

      return {
        [err.context.label]: translatedLabel
          ? err.message.replace(err.context.label, translatedLabel)
          : err.message
      };
    });

    console.log(errors);

    customError.errors = errors;

    return res
      .status(customError.statusCode)
      .json({ errors: customError.errors });
  }

  // Si l'email est dupliqué
  if (err.code && err.code === '23505') {
    customError.msg = `Email déjà existant`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandler;
