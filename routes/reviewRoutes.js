import express from 'express';
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, createReview);
router.get('/', getAllReviews);  // Suponiendo que esta ruta no requiere autenticación
router.get('/:id', getReviewById); // Suponiendo que esta ruta no requiere autenticación
router.put('/:id', authenticateToken, updateReview);
router.delete('/:id', authenticateToken, deleteReview);

export default router;
