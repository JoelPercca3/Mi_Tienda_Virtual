import express from 'express';
import {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress
} from '../controllers/addressController.js';

const router = express.Router();

router.post('/', createAddress);
router.get('/', getAllAddresses);
router.get('/:id', getAddressById);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

export default router;
