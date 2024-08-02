import express from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct, upload } from '../controllers/productController.js';

const router = express.Router();

// Ruta para crear un producto con imagen
router.post('/create', upload.single('image'), createProduct);

// Ruta para obtener todos los productos
router.get('/', getProducts);

// Ruta para obtener un producto por ID
router.get('/:id', getProductById);

// Ruta para actualizar un producto con imagen
router.put('/:id', upload.single('image'), updateProduct);

// Ruta para eliminar un producto
router.delete('/:id', deleteProduct);

export default router;
