const { UnauthenticatedError } = require('../errors');
const { isTokenValid, attachCookiesToResponse } = require('../utils');
const db = require('../db');

const authenticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }

    const payload = isTokenValid(refreshToken);

    const {
      rows: [existingToken]
    } = await db.query(
      'SELECT * FROM tokens JOIN users ON tokens.user_id = users.user_id'
    );

    if (!existingToken || !existingToken?.isValid) {
      throw new UnauthenticatedError('Authentification Invalide');
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: payload.refreshToken
    });

    req.user = payload.user;
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentification invalide');
  }
};

const authorizePermissions = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Non autorisé à accéder à cette route'
      );
    }

    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
