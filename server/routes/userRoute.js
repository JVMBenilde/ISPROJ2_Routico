import express from 'express';
import { getAllUsers } from '../controllers/userController.js';
import { verifyToken, requireSuperAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/users
router.get('/', verifyToken, requireSuperAdmin, getAllUsers);

export default router;
