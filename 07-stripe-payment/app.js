require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

// controller
const stripeController = require('./controllers/stripeController');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.static('./public'));
app.use(express.json());

// stripe
app.post('/stripe', stripeController);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Le serveur écoute sur le port ${port}...`));
