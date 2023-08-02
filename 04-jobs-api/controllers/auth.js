const db = require('../db');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const { createJWT } = require('../utils/tokenUtils.js');
const { hashPassword, comparePassword } = require('../utils/passwordUtils.js');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // if (!name || name.length < 3 || name.length > 50) {
  //   throw new BadRequestError(
  //     'Veuillez fournir un nom valide entre 3 et 50 caractères'
  //   );
  // }

  // const isValidEmail =
  //   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
  //     email
  //   );

  // if (!email || !isValidEmail) {
  //   throw new BadRequestError('Veuillez fournir un email valide');
  // }

  // if (!password || password.length < 6) {
  //   throw new BadRequestError(
  //     'Veuillez founir un mot de passe avec au moins 6 caractères'
  //   );
  // }

  // crypte le mot de passe
  const hashedPassword = await hashPassword(password);
  // insère l'utilisateur avec le mot de passe crypté
  const {
    rows: [user]
  } = await db.query(
    'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *',
    [name, email, hashedPassword]
  );

  // génénère le token
  const token = createJWT({ userID: user.user_id, name: user.name });

  res.status(StatusCodes.CREATED).send({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // if (!email || !password) {
  //   throw new BadRequestError('Veuillez fournir un email et un mot passe');
  // }

  const {
    rows: [user]
  } = await db.query('SELECT * FROM USERS WHERE email = $1', [email]);

  if (!user) {
    throw new UnauthenticatedError('Identifiants incorrects');
  }

  // compare les mots de passe
  const isPasswordCorrect = comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Identifiants incorrects');
  }

  const token = createJWT({ userID: user.user_id, name: user.name });

  res.status(StatusCodes.OK).send({ user: { name: user.name }, token });
};

module.exports = { register, login };
