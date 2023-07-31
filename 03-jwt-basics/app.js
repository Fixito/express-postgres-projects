require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const router = require('./routes/main');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// middlewares
app.use(express.static('./public'));
app.use(express.json());

app.use('/api/v1/', router);

app.use(notFound);
app.use(errorHandler);

app.listen(5000, () => {
  console.log('Le serveur écoute sur le port 5000...');
});
