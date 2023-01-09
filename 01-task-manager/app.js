const express = require('express');
const app = express();
const tasks = require('./routes/tasks');
require('dotenv').config();
const notFound = require('./middleware/notFound');

app.use(express.static('./public'));
// middleware
app.use(express.json());
app.use('/api/v1/tasks', tasks);

app.use(notFound);

app.listen(5000, () => {
  console.log(`Le serveur écoute sur le port 5000...`);
});
