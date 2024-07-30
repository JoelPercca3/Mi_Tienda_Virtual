import User from '../models/User.js';
import db from '../config/db.js';

export const getAllUsers =async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM users');
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
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);

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
  const { name, email, password } = req.body;

  try {
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      email,
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

  const { name, email, password } = req.body;  // Obtiene los datos del usuario del cuerpo de la solicitud

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
    values.push(password);
  }
  
  query = query.slice(0, -2);
  query += ' WHERE id = ?';
  values.push(id);

  try {
    const [result] = await db.execute(query, values);

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
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting user' });
  }
}; 