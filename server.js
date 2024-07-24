import express from 'express';
import dotenv from 'dotenv';
import config from './config/config.js';
import db from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import cartRoutes from './routes/cartRoutes.js'; // Importa las rutas del carrito
import paymentRoutes from './routes/paymentRoutes.js';
import authRoutes from './routes/authRoutes.js'; // Asegúrate de que esta ruta esté importada
import reviewRoutes from './routes/reviewRoutes.js'; // Importar las rutas de reseñas



 // Importa las rutas de órdenes



// Importa tus rutas adicionales aquí...

dotenv.config();  // Carga las variables de entorno del archivo .env

const app = express();
app.use(express.json());

// Define tus rutas aquí...
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/cart', cartRoutes);  // Usa tus rutas del carrito
app.use('/api/payments', paymentRoutes);
app.use('/api/auth', authRoutes); // Asegúrate de que la ruta esté configurada
app.use('/api/reviews', reviewRoutes); // Añadir las rutas de reseñas




 // Usa las rutas de órdenes


// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
// Añade más rutas según sea necesario

// Middleware de manejo de errores
import { errorHandler } from './middlewares/errorMiddleware.js';
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
