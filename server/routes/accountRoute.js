// server/routes/accountRoute.js
import express from 'express';
import {
  getAllAccounts,
  addAdminAccount,
  updateAccount,
  deleteAccount
} from '../controllers/accountController.js';
import { verifyToken, requireSuperAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, requireSuperAdmin, getAllAccounts);
router.post('/add-admin', verifyToken, requireSuperAdmin, addAdminAccount);
router.put('/:id', verifyToken, requireSuperAdmin, updateAccount);
router.delete('/:id', verifyToken, requireSuperAdmin, deleteAccount);

export default router;
