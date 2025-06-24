import express from 'express';
import {
  getDrivers,
  addDriver,
  deleteDriver
} from '../controllers/driverController.js';

import { verifyToken as authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getDrivers);
router.post('/', addDriver);
router.delete('/:driverId', deleteDriver);

export default router;
