import express from 'express';
import { verifyOtp } from '../controllers/verifyOtpController.js';

const router = express.Router();
router.post('/', verifyOtp);
export default router;
