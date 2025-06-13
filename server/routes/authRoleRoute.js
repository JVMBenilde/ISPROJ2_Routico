import express from 'express';
import { getUserRole } from '../controllers/authRoleController.js';

const router = express.Router();

router.post('/', getUserRole);

export default router;
