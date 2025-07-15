import express from 'express';
import { getOrderHistory } from '../controllers/getOrderHistoryController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/history', verifyToken, getOrderHistory);

export default router;