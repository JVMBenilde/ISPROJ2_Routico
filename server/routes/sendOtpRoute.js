import express from 'express';
import { sendOtp } from '../controllers/registerController.js';

const router = express.Router();
router.post('/', sendOtp);
export default router;
