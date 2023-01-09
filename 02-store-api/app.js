const express = require('express');
const app = express();

app.get('/', async (req, res) => {
  res.send('hello world');
});

app.listen(5000, () => {
  console.log('Le serveur écoute sur le port 5000...');
});
