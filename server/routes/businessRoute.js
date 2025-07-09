import express from 'express';
import { verifyToken as authenticate } from '../middlewares/authMiddleware.js';
import { upload, submitBusiness, getMyBusinessRegistration, getMyRegistrations } from '../controllers/businessController.js';

const router = express.Router();

router.post('/', authenticate, upload.any(), submitBusiness);
router.get('/single', authenticate, getMyBusinessRegistration);
router.get('/registrations', authenticate, getMyRegistrations);


export default router;
