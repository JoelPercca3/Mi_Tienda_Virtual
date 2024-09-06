import bcrypt from 'bcrypt';
import User from '../models/User.js';
import db from '../config/db.js';

export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving users' });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;  // Obtiene el ID del usuario de los parámetros de la solicitud
  const userId = req.user.id; // Obtiene el ID del usuario autenticado desde el token

  // Asegúrate de que el usuario autenticado esté autorizado para acceder al perfil
  if (id != userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(rows[0]);  // Devuelve el primer (y único) resultado
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving user' });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, bio = null, avatar = null } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (name, email, password, bio, avatar) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, bio, avatar]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      bio,
      avatar,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating user' });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;  // Obtiene el ID del usuario de los parámetros de la solicitud
  const userId = req.user.id; // Obtiene el ID del usuario autenticado desde el token

  // Asegúrate de que el usuario autenticado esté autorizado para actualizar el perfil
  if (id != userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { name, email, password, bio, avatar } = req.body;  // Obtiene los datos del usuario del cuerpo de la solicitud

  // Construye la consulta SQL dinámica
  let query = 'UPDATE users SET ';
  const values = [];
  
  if (name) {
    query += 'name = ?, ';
    values.push(name);
  }
  if (email) {
    query += 'email = ?, ';
    values.push(email);
  }
  if (password) {
    query += 'password = ?, ';
    values.push(await bcrypt.hash(password, 10));
  }
  if (bio) {
    query += 'bio = ?, ';
    values.push(bio);
  }
  if (avatar) {
    query += 'avatar = ?, ';
    values.push(avatar);
  }
  
  query += 'updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  values.push(id);

  try {
    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating user' });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;  // Obtiene el ID del usuario de los parámetros de la solicitud

  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting user' });
  }
};

// Obtener perfil de usuario
export const getUserProfile = async (req, res) => {
  const userId = req.user.id; // Asumiendo que el ID del usuario viene del token de autenticación

  try {
    const [rows] = await db.query(
      'SELECT id, name, email, bio, avatar, created_at, updated_at FROM users WHERE id = ?', 
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Actualizar perfil de usuario
export const updateUserProfile = async (req, res) => {
  const userId = req.user.id; // Asumiendo que el ID del usuario viene del token de autenticación
  const { name, email, password, bio, avatar } = req.body;

  try {
    // Si el usuario quiere actualizar la contraseña
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const [result] = await db.query(
      `UPDATE users SET name = ?, email = ?, ${password ? 'password = ?,' : ''} bio = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      password ? [name, email, hashedPassword, bio, avatar, userId] : [name, email, bio, avatar, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
