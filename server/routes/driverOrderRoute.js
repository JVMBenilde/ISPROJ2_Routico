import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getOrderById } from '../controllers/getOrderByIdController.js';

const router = express.Router();

router.get('/orders/:order_id', verifyToken, getOrderById);

export default router;