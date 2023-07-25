const { StatusCodes } = require('http-status-codes');
const { BadRequestError, ValidationError } = require('../errors/index.js');
const { registerSchema, loginSchema } = require('../schemas');
const db = require('../db');
const {
  hashPassword,
  createUserToken,
  attachCookieToResponse,
  comparePassword
} = require('../utils');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const { error } = registerSchema.validate(req.body, { abortEarly: false });

  if (error) {
    throw new ValidationError('Échec de la validation.', error.details);
  }

  const {
    rows: [emailAlreadyExists]
  } = await db.query('SELECT email FROM users WHERE email = $1', [email]);

  if (emailAlreadyExists) {
    throw new BadRequestError("L'adresse email existe déjà.");
  }

  const {
    rows: [{ count }]
  } = await db.query('SELECT COUNT(*) FROM users');
  const isFirstAccount = Number(count) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const hashedPassword = await hashPassword(password);

  const {
    rows: [user]
  } = await db.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, hashedPassword, role]
  );

  const userToken = createUserToken(user);
  attachCookieToResponse({ res, user: userToken });

  res.status(StatusCodes.CREATED).json({ user: userToken });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate(req.body, { abortEarly: false });

  if (error) {
    throw new ValidationError('Échec de la validation.', error.details);
  }

  const {
    rows: [user]
  } = await db.query('SELECT * FROM users WHERE email = $1', [email]);

  if (!user) {
    throw new BadRequestError('Identifiants incorrects.');
  }

  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new BadRequestError('Identifiants incorrects.');
  }

  const userToken = createUserToken(user);
  attachCookieToResponse({ res, user: userToken });

  res.status(StatusCodes.CREATED).json({ user: userToken });
};

const logout = async (_req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 1000)
  });

  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

module.exports = { register, login, logout };
