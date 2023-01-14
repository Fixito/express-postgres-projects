const register = (req, res) => {
  res.send('enregistre un utilisateur');
};

const login = (req, res) => {
  res.send('connecte un utilisateur');
};

module.exports = { register, login };
