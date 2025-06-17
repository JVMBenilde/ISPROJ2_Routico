import express from 'express';
import {
  getDrivers,
  addDriver,
  updateDriver,
  deleteDriver
} from '../controllers/driverController.js';

import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.use(authenticate);

router.get('/', getDrivers);
router.post('/', addDriver);
router.put('/:driverId', updateDriver);
router.delete('/:driverId', deleteDriver);

export default router;
