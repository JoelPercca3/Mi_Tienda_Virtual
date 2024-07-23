import express from 'express';
import dotenv from 'dotenv';
import config from './config/config.js';
import db from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';


// Importa tus rutas adicionales aquí...

dotenv.config();  // Carga las variables de entorno del archivo .env

const app = express();
app.use(express.json());

// Define tus rutas aquí...
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);


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
