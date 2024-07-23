import db from '../config/db.js';

class User {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM users');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(username, email, password) {
    const [result] = await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password]);
    return result.insertId;
  }

  static async update(id, username, email, password) {
    await db.query('UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?', [username, email, password, id]);
  }

  static async delete(id) {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
  }
}

export default User;


