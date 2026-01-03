import User from '../models/User.js';
import Leave from '../models/Leave.js';

// Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.findAll({
      attributes: ['id', 'email', 'role', 'fullName', 'phone', 'address', 'department', 'jobTitle', 'joiningDate', 'basicSalary', 'allowances', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    const employeesWithId = employees.map(emp => ({
      ...emp.toJSON(),
      employeeId: `EMP${String(emp.id).padStart(3, '0')}`,
      totalSalary: (parseFloat(emp.basicSalary) || 0) + (parseFloat(emp.allowances) || 0)
    }));

    res.status(200).json({
      success: true,
      data: employeesWithId
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees',
      error: error.message
    });
  }
};

// Get employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await User.findByPk(id, {
      attributes: ['id', 'email', 'role', 'fullName', 'phone', 'address', 'profilePicture', 'department', 'jobTitle', 'joiningDate', 'basicSalary', 'allowances', 'createdAt']
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const employeeData = {
      ...employee.toJSON(),
      employeeId: `EMP${String(employee.id).padStart(3, '0')}`,
      totalSalary: (parseFloat(employee.basicSalary) || 0) + (parseFloat(employee.allowances) || 0)
    };

    res.status(200).json({
      success: true,
      data: employeeData
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee',
      error: error.message
    });
  }
};

// Update employee details
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const employee = await User.findByPk(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    await employee.update(updateData);

    const updatedEmployee = {
      ...employee.toJSON(),
      employeeId: `EMP${String(employee.id).padStart(3, '0')}`,
      totalSalary: (parseFloat(employee.basicSalary) || 0) + (parseFloat(employee.allowances) || 0)
    };

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee',
      error: error.message
    });
  }
};

// Get employee attendance
export const getEmployeeAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock attendance data - implement actual attendance tracking later
    const mockAttendance = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: Math.random() > 0.1 ? 'Present' : (Math.random() > 0.5 ? 'Absent' : 'Leave'),
      checkIn: '09:00 AM',
      checkOut: '06:00 PM'
    }));

    res.status(200).json({
      success: true,
      data: mockAttendance
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance',
      error: error.message
    });
  }
};

// Get employee leaves
export const getEmployeeLeaves = async (req, res) => {
  try {
    const { id } = req.params;
    
    const leaves = await Leave.findAll({
      where: { userId: id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: leaves
    });
  } catch (error) {
    console.error('Error fetching employee leaves:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee leaves',
      error: error.message
    });
  }
};
