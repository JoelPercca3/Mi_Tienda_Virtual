import db from '../config/db.js';

// Crear una nueva dirección
export const createAddress = async (req, res) => {
  const { user_id, address_line1, address_line2, city, state, postal_code, country } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO addresses (user_id, address_line1, address_line2, city, state, postal_code, country) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, address_line1, address_line2, city, state, postal_code, country]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Obtener todas las direcciones 
export const getAllAddresses = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM addresses');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Obtener una dirección por ID
export const getAddressById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM addresses WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Actualizar una dirección
export const updateAddress = async (req, res) => {
  const { id } = req.params;
  const { address_line1, address_line2, city, state, postal_code, country } = req.body;
  try {
    const [result] = await db.execute(
      'UPDATE addresses SET address_line1 = ?, address_line2 = ?, city = ?, state = ?, postal_code = ?, country = ? WHERE id = ?',
      [address_line1, address_line2, city, state, postal_code, country, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    const [rows] = await db.execute('SELECT * FROM addresses WHERE id = ?', [id]);
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Eliminar una dirección
export const deleteAddress = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM addresses WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
