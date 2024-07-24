import db from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../config/config.js';

const SECRET_KEY = config.jwt.secret;

// Login usuario
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Obtener usuario de la base de datos
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const user = rows[0];
    
    // Verificar contraseña
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Crear token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    
    // Devolver el token y datos del usuario
    res.json({
      id: user.id,
      email: user.email,
      token
    });
  } catch (error) {
    console.error('Error during authentication', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Registro de usuario
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // Verificar si el usuario ya existe
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insertar nuevo usuario
    const [result] = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
    
    // Crear token JWT
    const token = jwt.sign({ id: result.insertId, email }, SECRET_KEY, { expiresIn: '1h' });
    
    res.status(201).json({
      id: result.insertId,
      email,
      token
    });
  } catch (error) {
    console.error('Error during registration', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
