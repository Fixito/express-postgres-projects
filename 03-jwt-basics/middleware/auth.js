const jwt = require('jsonwebtoken');

const authenticationMiddleware = async (req, res, next) => {
  // console.log(req.headers.authorization);
  // next();
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // TODO: error
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, username } = decoded;
    req.user = { id, username };
    next();
  } catch (error) {
    // TODO: error
  }
};

module.exports = authenticationMiddleware;
