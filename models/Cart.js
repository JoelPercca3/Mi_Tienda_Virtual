import db from '../config/db.js';

export const addProductToCart = async (userId, productId, quantity) => {
    const [result] = await db.query(
        'INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, productId, quantity]
    );
    return result.insertId;
};

export const getCartByUserId = async (userId) => {
    const [rows] = await db.query(
        'SELECT * FROM carts WHERE user_id = ?',
        [userId]
    );
    return rows;
};

export const updateCartQuantity = async (userId, productId, quantity) => {
    const [result] = await db.query(
        'UPDATE carts SET quantity = ? WHERE user_id = ? AND product_id = ?',
        [quantity, userId, productId]
    );
    return result.affectedRows;
};

export const removeProductFromCart = async (userId, productId) => {
    const [result] = await db.query(
        'DELETE FROM carts WHERE user_id = ? AND product_id = ?',
        [userId, productId]
    );
    return result.affectedRows;
};
