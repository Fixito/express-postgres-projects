const db = require('../db');
const CustomError = require('../errors/customError');

// 1 - vérifier username et password dans la requête POST(login)
// 2 - si ils existent, on créé un nouveau JWT
// 3 - envoyer le JWT au front-end

const login = (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  //* Joi package
  //* vérifier manuellement dans le controller

  if (!username || !password) {
    throw new CustomError('Veuillez fournir un email et un mot de passe', 400);
    // throw new BadRequestError('Veuillez fournir un email et un mot de passe');
  }

  res.send('Fake Login/Register/Signup Route');
};

const dashboard = (req, res) => {
  const luckyNumber = Math.floor(Math.random() * 100);

  res.status(200).json({
    msg: `Hello, ${req.user.username}`,
    secret: `Here is your authorized data, your lucky number is ${luckyNumber}`
  });
};

module.exports = { login, dashboard };
