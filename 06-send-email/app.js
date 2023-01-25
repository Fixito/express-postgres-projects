require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const sendEmail = require('./controllers/sendEmail');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// routes
app.get('/', (_req, res) => {
  res.send('<h1>Projet Email</h1><a href="/send">Envoyer un email</a>');
});

app.get('/send', sendEmail);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}...`);
});
