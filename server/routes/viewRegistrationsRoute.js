import express from 'express';
import {
  getAllBusinessRegistrations,
  approveBusinessRegistration,
  disapproveBusinessRegistration,
} from '../controllers/viewRegistrationsController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/view-registrations
router.get('/', verifyToken, getAllBusinessRegistrations);

// POST /api/view-registrations/:userId/approve
router.post('/:id/approve', verifyToken, approveBusinessRegistration);

// POST /api/view-registrations/:userId/disapprove
router.post('/:id/disapprove', verifyToken, disapproveBusinessRegistration);

export default router;