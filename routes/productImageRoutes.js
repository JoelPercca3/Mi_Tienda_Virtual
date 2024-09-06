import express from 'express';
import { addProductImage, getProductImages, deleteProductImage } from '../controllers/productImageController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas protegidas para manejar imágenes de productos
router.post('/add', authenticateToken, addProductImage);
router.get('/:productId', authenticateToken, getProductImages);
router.delete('/:id', authenticateToken, deleteProductImage);

export default router;
