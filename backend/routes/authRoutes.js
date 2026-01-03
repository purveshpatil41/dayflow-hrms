import express from 'express';
import {
  register,
  login,
  verifyEmail,
  verifyOTP,
  getMe,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/verify-otp', verifyOTP);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);

export default router;
