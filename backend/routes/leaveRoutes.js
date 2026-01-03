import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} from '../controllers/leaveController.js';

const router = express.Router();

router.post('/apply', protect, applyLeave);
router.get('/my-leaves', protect, getMyLeaves);
router.get('/all', protect, getAllLeaves);
router.put('/:id/status', protect, updateLeaveStatus);

export default router;
