const { UnauthorizedError } = require('../errors');

const checkPermissions = (requestUser, ressourceUserId) => {
  // console.log(requestUser);
  // console.log(ressourceUserId);
  // console.log(typeof ressourceUserId);

  if (requestUser.role === 'admin') return;
  if (requestUser.userId === ressourceUserId.toString()) return;
  throw new UnauthorizedError('Accès à cette route non autorisé.');
};

module.exports = checkPermissions;
