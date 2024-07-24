import db from '../config/db.js';

export const createOrder = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { user_id, total, items } = req.body;

    // Start a transaction
    await connection.beginTransaction();

    // Insert the order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total, created_at) VALUES (?, ?, NOW())',
      [user_id, total]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    if (items && items.length > 0) {
      for (let item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price]
        );
      }
    }

    // Commit the transaction
    await connection.commit();

    res.status(201).json({ id: orderId, user_id, total });
  } catch (error) {
    // Rollback the transaction in case of an error
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { user_id, total } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE orders SET user_id = ?, total = ? WHERE id = ?',
      [user_id, total, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ id, user_id, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
    const { id } = req.params;
  
    try {
      const [result] = await db.query('DELETE FROM orders WHERE id = ?', [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // Enviar mensaje de éxito
      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };