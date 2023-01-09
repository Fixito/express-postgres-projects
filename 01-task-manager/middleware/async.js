const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      // next() passe au middleware suivant (en l'occurence errorHandlerMiddleware -> voir app.js)
      next(error);
    }
  };
};

module.exports = asyncWrapper;
