import db from '../config/db.js';

// Crear una categoría
export const createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const [result] = await db.execute('INSERT INTO categories (name, description, created_at) VALUES (?, ?, NOW())', [name, description]);
    res.status(201).json({ id: result.insertId, name, description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating category' });
  }
};

// Obtener todas las categorías
export const getCategories = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM categories');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving categories' });
  }
};

// Obtener una categoría por ID
export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute('SELECT * FROM categories WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving category' });
  }
};

// Actualizar una categoría
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const [result] = await db.execute('UPDATE categories SET name = ?, description = ? WHERE id = ?', [name, description, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({ id, name, description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating category' });
  }
};

// Eliminar una categoría
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // Primero, eliminamos las asociaciones en product_categories
    await db.execute('DELETE FROM product_categories WHERE category_id = ?', [id]);

    // Luego, eliminamos la categoría
    const [result] = await db.execute('DELETE FROM categories WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting category' });
  }
};
