import db from '../config/db.js';

class User {
  // Obtener todos los usuarios junto con sus roles
  static async getAll() {
    const [rows] = await db.query(`
      SELECT u.id, u.name, u.email, u.bio, u.avatar, r.role_name, u.created_at, u.updated_at
      FROM users u
      JOIN roles r ON u.role_id = r.id
    `);
    return rows;
  }

  // Obtener un usuario por ID junto con su rol
  static async getById(id) {
    const [rows] = await db.query(`
      SELECT u.id, u.name, u.email, u.bio, u.avatar, r.role_name, u.created_at, u.updated_at
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `, [id]);
    return rows[0];
  }

  // Crear un nuevo usuario con asignación de rol
  static async create(name, email, password, roleId = 2, bio = null, avatar = null) { // Asignar rol de 'user' por defecto
    const [result] = await db.query(`
      INSERT INTO users (name, email, password, role_id, bio, avatar)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, email, password, roleId, bio, avatar]);
    return result.insertId;
  }

  // Actualizar un usuario existente, con la opción de cambiar su rol
  static async update(id, name, email, password = null, roleId = null, bio = null, avatar = null) {
    let query = `
      UPDATE users 
      SET name = ?, email = ?, bio = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP
    `;
    const values = [name, email, bio, avatar];

    // Si se proporciona un nuevo password, lo actualizamos
    if (password) {
      query += ', password = ?';
      values.push(password);
    }

    // Si se proporciona un nuevo roleId, lo actualizamos
    if (roleId) {
      query += ', role_id = ?';
      values.push(roleId);
    }

    query += ' WHERE id = ?';
    values.push(id);

    await db.query(query, values);
  }

  // Eliminar un usuario
  static async delete(id) {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
  }
}

export default User;
