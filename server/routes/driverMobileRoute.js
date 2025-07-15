import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getAssignedOrders } from '../controllers/getAssignedOrdersController.js';
import { getOrderById } from '../controllers/getOrderByIdController.js';
import { updateOrderStatus } from '../controllers/updateOrderStatusController.js'; 

const router = express.Router();

router.get('/assigned-orders', verifyToken, getAssignedOrders);
router.get('/orders/:order_id', verifyToken, getOrderById);

router.patch('/orders/:order_id/status', verifyToken, updateOrderStatus);

export default router;
