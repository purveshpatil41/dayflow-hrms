import express from 'express';
import { getAllEmployees, getEmployeeById, updateEmployee, getEmployeeAttendance, getEmployeeLeaves } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }
    next();
  };
};

router.get('/employees', protect, authorize('Admin', 'HR'), getAllEmployees);
router.get('/employees/:id', protect, authorize('Admin', 'HR'), getEmployeeById);
router.put('/employees/:id', protect, authorize('Admin', 'HR'), updateEmployee);
router.get('/employees/:id/attendance', protect, authorize('Admin', 'HR'), getEmployeeAttendance);
router.get('/employees/:id/leaves', protect, authorize('Admin', 'HR'), getEmployeeLeaves);

export default router;
