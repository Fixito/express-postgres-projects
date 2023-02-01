const createTokenUser = (user) => ({
  name: user.name,
  userId: user.user_id,
  role: user.role
});

module.exports = createTokenUser;
