import express from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser,getUserProfile, updateUserProfile,  } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas públicas (si es necesario)
router.get('/', getAllUsers);
router.post('/create', createUser);

// Rutas protegidas
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);
// Ruta para obtener perfil de usuario
router.get('/profile', authenticateToken, getUserProfile);

// Ruta para actualizar perfil de usuario
router.put('/profile', authenticateToken, updateUserProfile);

export default router;
