const { UnauthenticatedError } = require('../errors');
const { isTokenValid } = require('../utils/jwt.js');

const authenticateUser = (req, _res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new UnauthenticatedError('Authentification non valide.');
  }

  try {
    const { name, userId, role } = isTokenValid(token);
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentification non valide.');
  }
};

const authorizePermissions = (...roles) => {
  return (req, _res, next) => {
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      throw new UnauthenticatedError('Unauthorized to access this route');
    }

    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
