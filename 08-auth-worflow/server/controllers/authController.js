const db = require('../db');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const {
  attachCookiesToResponse,
  comparePassword,
  hashPassword,
  createHash,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail
} = require('../utils/');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || name.length <= 3 || name.length >= 50) {
    throw new BadRequestError(
      'Veuillez fournir un nom valide entre 3 et 50 caractères'
    );
  }

  const isValidEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    );

  if (!email || !isValidEmail) {
    throw new BadRequestError('Veuillez fournir un email valide');
  }

  if (!password || password.length < 6) {
    throw new BadRequestError(
      'Veuillez founir un mot de passe avec au moins 6 caractères'
    );
  }

  // Le premier utilisateur enregistré est un admin
  const {
    rows: [{ count: isFirstAccount }]
  } = await db.query('SELECT COUNT(*) FROM users');

  const role = isFirstAccount === '0' ? 1 : 2;

  const hashedPassword = await hashPassword(password);

  const verificationToken = crypto.randomBytes(40).toString('hex');

  const {
    rows: [user]
  } = await db.query(
    'INSERT INTO users(name, email, password, role_id, verification_token) VALUES($1, $2, $3, $4, $5) RETURNING *',
    [name, email, hashedPassword, role, verificationToken]
  );

  const origin = 'http://localhost:5173';

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verification_token,
    origin
  });

  // Envoyer le token de vérification que lorsqu'on teste avec Postman
  res.status(StatusCodes.CREATED).json({
    msg: 'Succès ! Veuillez vérifier votre email pour vérifier votre compte.',
    verificationToken: user.verification_token
  });
};

const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.body;

  const {
    rows: [user]
  } = await db.query('SELECT * FROM users WHERE email = $1', [email]);

  if (!user) {
    throw new UnauthenticatedError('Vérification échouée');
  }

  if (user.verification_token !== verificationToken) {
    throw new UnauthenticatedError('Vérification échouée');
  }

  await db.query(
    'UPDATE users SET is_verified = true, verified = NOW(), verification_token = NULL WHERE user_id = $1',
    [user.user_id]
  );

  res.status(StatusCodes.OK).json({ msg: 'Email vérifié' });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Veuillez fournir un email et un mot passe');
  }

  const {
    rows: [user]
  } = await db.query(
    'SELECT * FROM users JOIN roles ON users.role_id = roles.role_id WHERE users.email = $1',
    [email]
  );

  if (!user) {
    throw new UnauthenticatedError('Identifiants incorrects');
  }

  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Identifiants incorrects');
  }

  if (!user.is_verified) {
    throw new CustomError.UnauthenticatedError('Veuillez vérifier votre email');
  }

  // génénère le token
  const tokenUser = createTokenUser(user);

  //crée un token de rafraîchissement
  let refreshToken = '';
  // vérifie un token existant
  const {
    rows: [existingToken]
  } = await db.query('SELECT * FROM tokens WHERE user_id = $1', [user.user_id]);

  if (existingToken) {
    const { is_valid } = existingToken;

    if (!is_valid) {
      throw new UnauthenticatedError('Identifiants incorrects');
    }

    refreshToken = existingToken.refresh_token;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;
  const userToken = [refreshToken, ip, userAgent, user.user_id];

  await db.query(
    'INSERT INTO tokens(refresh_token, ip, user_agent, user_id) VALUES($1, $2, $3, $4)',
    userToken
  );

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  await db.query('DELETE FROM tokens WHERE user_id = $1', [req.user.userID]);

  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now())
  });
  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now())
  });

  res.status(StatusCodes.OK).json({ msg: 'Utilisateur déconnecté !' });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new CustomError.BadRequestError('Veuillez fournir un email valide');
  }

  const {
    rows: [user]
  } = await db.query('SELECT * FROM  users WHERE email = $1', [email]);

  if (user) {
    let passwordToken = crypto.randomBytes(70).toString('hex');
    // envoie un email
    const origin = 'http://localhost:5173';
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    passwordToken = createHash(passwordToken);

    await db.query(
      'UPDATE users SET password_token = $1, password_token_expiration_date = $2 WHERE user_id = $3',
      [passwordToken, passwordTokenExpirationDate, user.user_id]
    );
  }

  res.status(StatusCodes.OK).json({
    msg: 'Veuillez vérifier votre e-mail pour le lien de réinitialisation du mot de passe'
  });
};

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;

  if (!token || !email || !password) {
    throw new CustomError.BadRequestError('Veuillez fournir tous les champs');
  }

  const {
    rows: [user]
  } = await db.query('SELECT * FROM  users WHERE email = $1', [email]);

  if (user) {
    const currentDate = new Date();

    if (
      user.password_token === createHash(token) &&
      user.password_token_expiration_date > currentDate
    ) {
      const hashedPassword = await hashPassword(password);

      await db.query(
        'UPDATE users SET password = $1, password_token = NULL, password_token_expiration_date = NULL WHERE user_id = $2',
        [hashedPassword, user.user_id]
      );
    }
  }

  res.status(StatusCodes.OK).send('Mot de apsse réinitialisé');
};

module.exports = {
  register,
  login,
  verifyEmail,
  logout,
  forgotPassword,
  resetPassword
};
