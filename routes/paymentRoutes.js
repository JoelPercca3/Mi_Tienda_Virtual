import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js'; // Asegúrate de que la ruta sea correcta
import {
  createPayment,
  getPaymentById,
  getAllPayments,
  updatePayment,
  deletePayment
} from '../controllers/paymentController.js';

const router = express.Router();

// Rutas protegidas con el middleware authenticateToken
router.post('/', authenticateToken, createPayment);
router.get('/', authenticateToken, getAllPayments);
router.get('/:id', authenticateToken, getPaymentById);
router.put('/:id', authenticateToken, updatePayment);
router.delete('/:id', authenticateToken, deletePayment);

export default router;
