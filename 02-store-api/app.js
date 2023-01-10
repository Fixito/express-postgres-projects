require('dotenv').config();
//* async errors
// nous évite d'avoir à refaire notre async middleware
require('express-async-errors');

const express = require('express');
const app = express();

const notFoundMiddleware = require('./middleware/notFound');
const errorMiddleware = require('./middleware/errorHandler');

const products = require('./routes/products');

app.get('/', (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
});

app.use('/api/v1/products', products);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(5000, () => {
  console.log('Le serveur écoute sur le port 5000...');
});
