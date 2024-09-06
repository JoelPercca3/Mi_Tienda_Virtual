// routes/authRoutes.js
import express from 'express';
import {loginAdmin ,loginUser, registerUser, googleLogin, refreshToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/google-login', googleLogin); // Ruta para autenticación con Google
router.post('/refresh', refreshToken);
router.post('/admin/login', loginAdmin);

export default router;
