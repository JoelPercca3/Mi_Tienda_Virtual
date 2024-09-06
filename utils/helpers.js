import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpiresIn });
};
