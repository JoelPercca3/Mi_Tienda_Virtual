import Payment from '../models/Payment.js';
import db from '../config/db.js';

export const createPayment = async (req, res) => {
  const { order_id, payment_method, amount, status } = req.body;
  try {
    const [rows] = await db.execute('SELECT id FROM orders WHERE id = ?', [order_id]);
    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid order_id' });
    }

    const id = await Payment.create(order_id, payment_method, amount, status);
    res.status(201).json({ id, message: 'Payment created successfully' });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

export const getPaymentById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM payments WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM payments');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};


export const updatePayment = async (req, res) => {
  const { id } = req.params;
  const { payment_method, amount, status } = req.body;

  try {
    // Verificar si el payment_id existe en la tabla payments
    const [rows] = await db.execute('SELECT id FROM payments WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    await db.execute(
      'UPDATE payments SET payment_method = ?, amount = ?, status = ? WHERE id = ?',
      [payment_method, amount, status, id]
    );

    res.status(200).json({ message: 'Payment updated successfully' });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ error: 'Failed to update payment' });
  }
};
export const deletePayment = async (req, res) => {
  const { id } = req.params;
  try {
    // Verificar si el payment_id existe en la tabla payments
    const [rows] = await db.execute('SELECT id FROM payments WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    await db.execute('DELETE FROM payments WHERE id = ?', [id]);
    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ error: 'Failed to delete payment' });
  }
};

// Login para administrador
