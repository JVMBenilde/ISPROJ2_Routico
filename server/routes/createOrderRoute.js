import express from 'express';
import { createOrder } from '../controllers/createOrderController.js';
import { getOrderHistory } from '../controllers/getOrderHistoryController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/create-order', verifyToken, createOrder);
router.get('/history', verifyToken, getOrderHistory);

export default router;
