import db from '../config/db.js';

// Crear una nueva reseña
export const createReview = async (req, res) => {
  const { product_id, user_id, rating, comment } = req.body;
  
  try {
    const [result] = await db.execute(
      'INSERT INTO reviews (product_id, user_id, rating, comment, created_at) VALUES (?, ?, ?, ?, NOW())',
      [product_id, user_id, rating, comment]
    );
    res.status(201).json({
      id: result.insertId,
      product_id,
      user_id,
      rating,
      comment,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

// Obtener todas las reseñas
export const getAllReviews = async (req, res) => {
  try {
    const [reviews] = await db.execute('SELECT * FROM reviews');
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Obtener una reseña por ID
export const getReviewById = async (req, res) => {
  const { id } = req.params;

  try {
    const [reviews] = await db.execute('SELECT * FROM reviews WHERE id = ?', [id]);
    if (reviews.length === 0) return res.status(404).json({ error: 'Review not found' });
    res.json(reviews[0]);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
};

// Actualizar una reseña por ID
export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const [result] = await db.execute(
      'UPDATE reviews SET rating = ?, comment = ? WHERE id = ?',
      [rating, comment, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review updated successfully' });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

// Eliminar una reseña por ID
export const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute('DELETE FROM reviews WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};
