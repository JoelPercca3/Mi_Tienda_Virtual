import { body } from 'express-validator';

export const userValidationRules = () => {
  return [
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ];
};

export const productValidationRules = () => {
  return [
    body('name').not().isEmpty().withMessage('Product name is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  ];
};

export const categoryValidationRules = () => {
  return [
    body('name').not().isEmpty().withMessage('Category name is required'),
  ];
};

export const reviewValidationRules = () => {
  return [
    body('productId').isInt().withMessage('Product ID must be an integer'),
    body('userId').isInt().withMessage('User ID must be an integer'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().isString().withMessage('Comment must be a string'),
  ];
};
