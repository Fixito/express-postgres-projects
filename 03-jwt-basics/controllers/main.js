const CustomError = require('../errors/customError');

// vérifier username et password dans la requête POST(login)
// si ils existent, on créé un nouveau JWT
// envoyer le JWT au front-end

//* 1 - Setup l'authentification pour que, seulement, la requête avec le JWT puisse accéder au dashboard
const jwt = require('jsonwebtoken');

// dans un vrai projet, il y aurait une distinction entre les routes pour login/register/signup
const login = (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  //* 3 options pour vérifier que les infos existent
  //* express-validator
  //* vérifier manuellement dans le controller

  if (!username || !password) {
    throw new CustomError('Veuillez fournir un email et un mot de passe', 400);
  }

  const id = new Date().getTime();

  //* essayer de garder le payload court, mieux pour l'UX (on envoie moins de données)
  //! en production, il faut utiliser un string long, complexe et indevinable !!!
  // args - payload, secret, options
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

  // res.send('Fake Login/Register/Signup Route');

  // TODO: récupérer le token via Postman essayer le décrypter sur le site de JWT
  res.status(200).json({ msg: 'utilisateur créé', token });
};

const dashboard = (req, res) => {
  const luckyNumber = Math.floor(Math.random() * 100);

  res.status(200).json({
    msg: `Hello, ${req.user?.username}`,
    secret: `Voici vos données autorisées, votre numéro porte-bonheur est le ${luckyNumber}`
  });
};

module.exports = { login, dashboard };
