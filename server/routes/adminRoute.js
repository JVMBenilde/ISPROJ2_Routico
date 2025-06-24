import express from 'express';
import {
  listAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from '../controllers/adminController.js';
import { verifyToken, requireSuperAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Only Super Admins can access admin management routes
router.use(verifyToken, requireSuperAdmin);

// List all admins
router.get('/admins', listAdmins);

// Create a new admin
router.post('/admins', createAdmin);

// Update an admin
router.put('/admins/:userId', updateAdmin);

// Delete an admin
router.delete('/admins/:userId', deleteAdmin);

export default router;
