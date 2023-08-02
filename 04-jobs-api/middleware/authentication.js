const { UnauthenticatedError } = require('../errors');
const { verifyJWT } = require('../utils/tokenUtils.js');

const auth = (req, _res, next) => {
  // vérifie le header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentification invalide');
  }

  const token = authHeader.split(' ')[1];

  try {
    const { userID, name } = verifyJWT(token);

    // attache l'utilisateur pour la route jobs
    req.user = {
      userID,
      name
    };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentification invalide');
  }
};

module.exports = auth;
