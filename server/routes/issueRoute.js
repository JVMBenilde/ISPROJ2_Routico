import express from 'express';
import {
  getAllIssues,
  deleteIssue,
  updateIssueStatus,
  getAllIssueCategories,
  reportIssue,
  upload
} from '../controllers/issueController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET all issues (with reporter name, context, etc.)
router.get('/', verifyToken, getAllIssues);

// DELETE issue by ID
router.delete('/:id', verifyToken, deleteIssue);

// PUT update issue status by ID
router.put('/:id', verifyToken, updateIssueStatus);

// GET all issue categories
router.get('/issue-categories', getAllIssueCategories);

// POST a new issue
router.post('/', verifyToken, upload.single('proof_attachment'), reportIssue);

export default router;
