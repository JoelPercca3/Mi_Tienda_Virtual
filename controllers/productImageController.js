import db from '../config/db.js';

// Agregar una imagen al producto
export const addProductImage = async (req, res) => {
  const { productId, imageUrl } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO product_images (product_id, image_url) VALUES (?, ?)',
      [productId, imageUrl]
    );

    res.status(201).json({
      id: result.insertId,
      product_id: productId,
      image_url: imageUrl,
    });
  } catch (error) {
    console.error('Error adding product image', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Obtener imágenes de un producto
export const getProductImages = async (req, res) => {
  const { productId } = req.params;

  try {
    const [images] = await db.query(
      'SELECT * FROM product_images WHERE product_id = ?',
      [productId]
    );

    res.status(200).json(images);
  } catch (error) {
    console.error('Error retrieving product images', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Eliminar una imagen del producto
export const deleteProductImage = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM product_images WHERE id = ?', [id]);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting product image', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
