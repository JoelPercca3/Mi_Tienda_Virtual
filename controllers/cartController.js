import db from '../config/db.js';

// Crear un nuevo ítem en el carrito
export const createCartItem = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  try {
    const [result] = await db.query('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [user_id, product_id, quantity]);
    res.status(201).json({ message: 'Cart item created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los ítems del carrito para un usuario
export const getCartItems = async (req, res) => {
  const { user_id } = req.query;

  try {
    const [rows] = await db.query('SELECT * FROM cart WHERE user_id = ?', [user_id]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar la cantidad de un ítem en el carrito
export const updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const [result] = await db.query('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Cart item not found' });
    } else {
      res.status(200).json({ message: 'Cart item updated successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un ítem del carrito
export const deleteCartItem = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM cart WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Cart item not found' });
    } else {
      res.status(200).json({ message: 'Cart item deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
