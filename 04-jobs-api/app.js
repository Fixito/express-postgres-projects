require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

//* routers
const jobs = require('./routes/jobs');
const auth = require('./routes/auth');

//*error handler
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Jobs API');
});

//* routes
app.use('/api/v1/jobs', jobs);
app.use('/api/v1/auth', auth);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}...`);
});
