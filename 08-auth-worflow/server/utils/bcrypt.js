const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (candidatePassword, password) =>
  await bcrypt.compare(candidatePassword, password);

module.exports = { comparePassword, hashPassword };
