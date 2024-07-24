import db from '../config/db.js';

const Payment = {
  async create(order_id, payment_method, amount, status) {
    const [result] = await db.execute(
      'INSERT INTO payments (order_id, payment_method, amount, status, created_at) VALUES (?, ?, ?, ?, NOW())',
      [order_id, payment_method, amount, status]
    );
    return result.insertId;
  },

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM payments WHERE id = ?', [id]);
    return rows[0];
  },

  async findAll() {
    const [rows] = await db.execute('SELECT * FROM payments');
    return rows;
  },

  async update(id, payment_method, amount, status) {
    const [result] = await db.execute(
      'UPDATE payments SET payment_method = ?, amount = ?, status = ? WHERE id = ?',
      [payment_method, amount, status, id]
    );
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await db.execute('DELETE FROM payments WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

export default Payment;
