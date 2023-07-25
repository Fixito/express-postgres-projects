const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const comparePassword = async function (candidatePassword, password) {
  const isMath = await bcrypt.compare(candidatePassword, password);
  return isMath;
};

module.exports = { hashPassword, comparePassword };
