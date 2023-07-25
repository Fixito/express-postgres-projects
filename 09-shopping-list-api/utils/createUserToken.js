const createUserToken = (user) => {
  return { name: user.name, userId: user.user_id, role: user.role };
};

module.exports = createUserToken;
