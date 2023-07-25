const translations = require('./translations.js');
const { hashPassword, comparePassword } = require('./bcrypt.js');
const createUserToken = require('./createUserToken.js');
const { attachCookieToResponse, isTokenValid } = require('./jwt.js');

module.exports = {
  translations,
  hashPassword,
  comparePassword,
  createUserToken,
  attachCookieToResponse,
  isTokenValid
};
