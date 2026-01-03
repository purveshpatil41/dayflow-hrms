import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Leave = sequelize.define('Leave', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employeeId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  employeeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  leaveType: {
    type: DataTypes.ENUM('Paid', 'Sick', 'Unpaid'),
    allowNull: false,
  },
  fromDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  toDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
    defaultValue: 'Pending',
  },
  adminComment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'leaves',
  timestamps: true,
});

export default Leave;
