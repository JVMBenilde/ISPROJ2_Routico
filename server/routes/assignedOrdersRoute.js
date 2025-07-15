import express from 'express';
import { getAssignedOrders } from '../controllers/getAssignedOrdersController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/assigned-orders', verifyToken, getAssignedOrders);

export default router;
