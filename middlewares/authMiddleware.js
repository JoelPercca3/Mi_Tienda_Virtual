import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

import config from '../config/config.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // Si no hay token, responder con Unauthorized

  jwt.verify(token, config.jwt.accessSecret, (err, user) => {
    if (err) return res.sendStatus(403); // Si el token no es válido, responder con Forbidden
    req.user = user;
    next();
  });
};
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
      next();
  } else {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
};


