import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Importa cors
import path from 'path';
import { fileURLToPath } from 'url'; // Necesario para obtener el directorio actual
import config from './config/config.js';
import db from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import { errorHandler } from './middlewares/errorMiddleware.js';
import productImageRoutes from './routes/productImageRoutes.js';

dotenv.config();  // Carga las variables de entorno del archivo .env

// Verificar que la configuración se carga correctamente
console.log("Access Token Secret:", config.jwt.accessSecret);
console.log("Refresh Token Secret:", config.jwt.refreshSecret);
console.log("Server Port:", config.port);

const app = express();

// Obtén el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ // Configura CORS para permitir solicitudes desde el frontend
  origin: 'http://localhost:5173', // URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Configura una ruta estática para servir archivos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define tus rutas aquí...
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/cart', cartRoutes);  // Usa tus rutas del carrito
app.use('/api/payments', paymentRoutes);
app.use('/api/auth', authRoutes); // Asegúrate de que la ruta esté configurada
app.use('/api/reviews', reviewRoutes);
app.use('/api/product-images', productImageRoutes);
 // Añadir las rutas de reseñas
// Middleware de manejo de errores
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
