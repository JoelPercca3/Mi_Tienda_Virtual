import db from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../config/config.js';
import { OAuth2Client } from 'google-auth-library';

// Configuraciones de JWT desde el archivo de configuración
const ACCESS_SECRET = config.jwt.accessSecret;
const REFRESH_SECRET = config.jwt.refreshSecret;
const ACCESS_EXPIRES_IN = config.jwt.accessExpiresIn;
const REFRESH_EXPIRES_IN = config.jwt.refreshExpiresIn;

// Cliente para la autenticación de Google
const client = new OAuth2Client(config.googleClientId);

// Verificar token de acceso
export const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_SECRET);
};

// Verificar token de refresco
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};

// Generar token de acceso
export const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
};

// Generar token de refresco
export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
};

// Iniciar sesión del usuario
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario por email
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];

    // Comparar contraseña
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generar tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Respuesta con los tokens y datos del usuario
    res.json({
      id: user.id,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Error during authentication', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Registrar usuario
// Función para registrar un nuevo usuario o administrador
export const registerUser = async (req, res) => {
    const { name, email, password, bio, avatar, role } = req.body;
  
    try {
      // Verificar si el usuario ya existe
      const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (existingUsers.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      // Validar el rol
      const validRoles = ['user', 'admin'];
      if (role && !validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role specified' });
      }
  
      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Asignar rol por defecto si no se proporciona
      const userRole = role || 'user';
  
      // Insertar el nuevo usuario en la base de datos
      const [result] = await db.query(
        'INSERT INTO users (name, email, password, bio, avatar, role) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, hashedPassword, bio || '', avatar || '', userRole]
      );
  
      // Generar tokens para el nuevo usuario
      const user = { id: result.insertId, email, role: userRole };
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
  
      // Responder con los datos del usuario y los tokens
      res.status(201).json({
        id: result.insertId,
        email,
        bio,
        avatar,
        role: userRole,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error('Error during registration', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

// Login con Google
export const googleLogin = async (req, res) => {
  const { email, name, googleId } = req.body;

  try {
    // Buscar si el usuario ya existe
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    let user = existingUsers[0];

    // Si no existe, crear un nuevo usuario
    if (!user) {
      const [result] = await db.query('INSERT INTO users (name, email, google_id) VALUES (?, ?, ?)', [name, email, googleId]);
      user = { id: result.insertId, name, email, googleId };
    }

    // Generar tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Respuesta con los tokens y datos del usuario
    res.status(200).json({
      id: user.id,
      email: user.email,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Error during Google login', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Autenticación con Google usando el token de ID de Google
export const googleAuth = async (req, res) => {
  const { token } = req.body;

  try {
    // Verificar el token de Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.googleClientId,
    });

    const { name, email, picture } = ticket.getPayload();

    // Buscar usuario por email
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    let user;
    if (rows.length > 0) {
      user = rows[0];
    } else {
      // Crear nuevo usuario si no existe
      const [result] = await db.query('INSERT INTO users (name, email, picture) VALUES (?, ?, ?)', [name, email, picture]);
      user = { id: result.insertId, name, email, picture };
    }

    // Generar tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Respuesta con los tokens y datos del usuario
    res.json({
      id: user.id,
      email: user.email,
      accessToken,
      refreshToken,
      picture: user.picture,
      name: user.name,
    });
  } catch (error) {
    console.error('Error during Google authentication', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Refrescar token
export const refreshToken = (req, res) => {
  const refreshToken = req.headers['authorization']?.split(' ')[1];

  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    // Generar nuevo token de acceso
    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  });
};
// login para Admin
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Busca al usuario por email
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      const user = rows[0];
  
      // Verificar que el usuario tenga rol de 'admin'
      if (user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
      }
  
      // Verificar la contraseña
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      // Generar tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
  
      // Responder con los tokens
      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error('Error during admin authentication', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

// Logs de configuración (opcional para ver que los valores están correctamente cargados)
console.log('ACCESS_SECRET:', ACCESS_SECRET);
console.log('REFRESH_SECRET:', REFRESH_SECRET);
console.log('ACCESS_EXPIRES_IN:', ACCESS_EXPIRES_IN);
console.log('REFRESH_EXPIRES_IN:', REFRESH_EXPIRES_IN);
