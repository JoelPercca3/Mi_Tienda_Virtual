import db from '../config/db.js';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Obtener el directorio actual del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar multer para manejar la carga de imágenes
const storage = multer.memoryStorage();
export const upload = multer({ storage });

const uploadPath = path.join(__dirname, 'uploads');

// Crear un producto con imagen
export const createProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;
  let imageUrl = null;

  try {
    // Validar que todos los campos requeridos estén presentes
    if (!name || !description || !price || !stock) {
      return res.status(400).json({ error: 'All fields (name, description, price, stock) are required.' });
    }

    if (req.file) {
      // Procesar y guardar la imagen
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const imagePath = path.join(uploadPath, fileName);

      await sharp(req.file.buffer)
        .resize(300, 300)
        .toFile(imagePath);

      imageUrl = `/uploads/${fileName}`;
    }

    // Ejecutar la consulta para insertar el producto en la base de datos
    const [result] = await db.execute(
      'INSERT INTO products (name, description, price, stock, image, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [name, description, price, stock, imageUrl || null]
    );

    // Responder con el producto creado, incluyendo el ID generado
    const response = { 
      id: result.insertId, 
      name, 
      description, 
      price, 
      stock, 
      created_at: new Date()  // La fecha de creación es ahora
    };

    if (imageUrl) {
      response.image = imageUrl;
    }

    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating product' });
  }
};

// Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM products');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving products' });
  }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving product' });
  }
};

// Actualizar un producto con imagen
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;
  let imageUrl = null;

  try {
    if (req.file) {
      // Procesar y guardar la imagen
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const imagePath = path.join(uploadPath, fileName);

      await sharp(req.file.buffer)
        .resize(300, 300)
        .toFile(imagePath);

      imageUrl = `/uploads/${fileName}`;

      // Eliminar la imagen anterior
      const [currentProduct] = await db.execute('SELECT image FROM products WHERE id = ?', [id]);
      if (currentProduct[0].image) {
        const oldImagePath = path.join(__dirname, currentProduct[0].image.replace('/uploads/', ''));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      await db.execute(
        'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image = ? WHERE id = ?',
        [name, description, price, stock, imageUrl, id]
      );
    } else {
      await db.execute(
        'UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?',
        [name, description, price, stock, id]
      );
    }

    res.status(200).json({ id, name, description, price, stock, image: imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating product' });
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Eliminar la imagen asociada
    const [currentProduct] = await db.execute('SELECT image FROM products WHERE id = ?', [id]);
    if (currentProduct[0].image) {
      const imagePath = path.join(__dirname, currentProduct[0].image.replace('/uploads/', ''));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting product' });
  }
};
