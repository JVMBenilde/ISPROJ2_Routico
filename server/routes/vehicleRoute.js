import express from 'express';
import {
  getAllVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle
} from '../controllers/vehicleController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getAllVehicles);
router.post('/', verifyToken, createVehicle);
router.put('/:id', verifyToken, updateVehicle); // ✅ ADD THIS
router.delete('/:id', verifyToken, deleteVehicle);

export default router;
