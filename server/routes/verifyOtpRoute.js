import express from 'express';
import { verifyOtp } from '../controllers/registerController.js';

const router = express.Router();
router.post('/', verifyOtp);
export default router;
