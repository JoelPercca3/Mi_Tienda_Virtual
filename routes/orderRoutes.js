import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js'; // Asegúrate de que la ruta sea correcta
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Rutas protegidas con el middleware authenticateToken
router.post('/create', authenticateToken, createOrder);
router.get('/', authenticateToken, getAllOrders);
router.get('/:id', authenticateToken, getOrderById);
router.put('/:id', authenticateToken, updateOrder);
router.delete('/:id', authenticateToken, deleteOrder);

export default router;
