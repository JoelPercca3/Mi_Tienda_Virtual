// routes/authRoutes.js
import express from 'express';
import { loginUser, registerUser, googleLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/google-login', googleLogin); // Ruta para autenticación con Google

export default router;
