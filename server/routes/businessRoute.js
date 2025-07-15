import express from 'express';
import { verifyToken as authenticate } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/upload.js';
import { 
  submitBusiness, 
  getMyBusinessRegistration, 
  getMyRegistrations 
} from '../controllers/businessController.js';

const router = express.Router();

router.post('/', (req, res, next) => {
  console.log('[ROUTE] POST /api/business-owners hit');
  next();
}, authenticate, upload.any(), (req, res, next) => {
  console.log('[ROUTE] After upload middleware');
  next();
}, submitBusiness);
router.get('/single', authenticate, getMyBusinessRegistration);
router.get('/registrations', authenticate, getMyRegistrations);

export default router;
