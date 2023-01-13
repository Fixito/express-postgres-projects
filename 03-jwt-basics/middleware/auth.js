const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const authenticationMiddleware = async (req, res, next) => {
  // console.log(req.headers.authorization);
  // next();
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Pas de token fournit');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, username } = decoded;
    req.user = { id, username };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Accès à cette route non autorisé');
  }
};

module.exports = authenticationMiddleware;
