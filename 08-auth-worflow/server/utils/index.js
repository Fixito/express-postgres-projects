const { comparePassword, hashPassword } = require('./bcrypt.js');
const createTokenUser = require('./createTokenUser.js');
const {
  createJWT,
  isTokenValid,
  attachCookiesToResponse
} = require('./jwt.js');
const sendEmail = require('./sendEmail.js');
const sendVerificationEmail = require('./sendVerificationEmail.js');
const createHash = require('./createHash.js');
const sendResetPasswordEmail = require('./sendResetPasswordEmail.js');

module.exports = {
  comparePassword,
  hashPassword,
  createTokenUser,
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  sendEmail,
  sendVerificationEmail,
  createHash,
  sendResetPasswordEmail
};
