import Leave from '../models/Leave.js';
import User from '../models/User.js';

export const applyLeave = async (req, res) => {
  try {
    const { employeeName, leaveType, fromDate, toDate, reason } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const leave = await Leave.create({
      employeeId: `EMP${String(userId).padStart(3, '0')}`,
      employeeName: employeeName || user.fullName || user.email,
      userId: userId,
      leaveType,
      fromDate,
      toDate,
      reason,
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      data: leave,
    });
  } catch (error) {
    console.error('Apply leave error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit leave application',
      error: error.message,
    });
  }
};

export const getMyLeaves = async (req, res) => {
  try {
    const userId = req.user.id;

    const leaves = await Leave.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: leaves,
    });
  } catch (error) {
    console.error('Get my leaves error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leave history',
      error: error.message,
    });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.role !== 'HR') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.',
      });
    }

    const leaves = await Leave.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: leaves,
    });
  } catch (error) {
    console.error('Get all leaves error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leave requests',
      error: error.message,
    });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.role !== 'HR') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.',
      });
    }

    const { id } = req.params;
    const { status, adminComment } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Approved or Rejected.',
      });
    }

    const leave = await Leave.findByPk(id);
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found',
      });
    }

    leave.status = status;
    if (adminComment) {
      leave.adminComment = adminComment;
    }
    await leave.save();

    res.status(200).json({
      success: true,
      message: `Leave request ${status.toLowerCase()} successfully`,
      data: leave,
    });
  } catch (error) {
    console.error('Update leave status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update leave status',
      error: error.message,
    });
  }
};
