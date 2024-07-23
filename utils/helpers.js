export const generateToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  };
  