import db from '../config/db.js';

// Crear un producto
export const createProduct = async (req, res) => {
  const { name, description, price } = req.body;

  try {
    const [result] = await db.execute('INSERT INTO products (name, description, price, created_at) VALUES (?, ?, ?, NOW())', [name, description, price]);
    res.status(201).json({ id: result.insertId, name, description, price });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating product' });
  }
};

// Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM products');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving products' });
  }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving product' });
  }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  try {
    const [result] = await db.execute('UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?', [name, description, price, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ id, name, description, price });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating product' });
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting product' });
  }
};
