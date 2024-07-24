import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js'; // Asegúrate de que la ruta sea correcta
import {
  createCartItem,
  getCartItems,
  updateCartItem,
  deleteCartItem
} from '../controllers/cartController.js';

const router = express.Router();

// Rutas protegidas con el middleware authenticateToken
router.post('/', authenticateToken, createCartItem);
router.get('/', authenticateToken, getCartItems);
router.put('/:id', authenticateToken, updateCartItem);
router.delete('/:id', authenticateToken, deleteCartItem);

export default router;
