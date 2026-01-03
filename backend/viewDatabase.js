import dotenv from 'dotenv';
import { sequelize } from './config/db.js';
import User from './models/User.js';
import Leave from './models/Leave.js';

// Load environment variables
dotenv.config();

async function viewDatabaseData() {
  try {
    console.log('🔍 Connecting to database...\n');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!\n');

    // View Users table
    console.log('👥 USERS TABLE:');
    console.log('==========================================');
    const users = await User.findAll({
      attributes: ['id', 'employeeId', 'email', 'fullName', 'role', 'phone', 'isVerified', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
    
    if (users.length > 0) {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user.id}`);
        console.log(`   Employee ID: ${user.employeeId}`);
        console.log(`   Name: ${user.fullName || 'Not provided'}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Phone: ${user.phone || 'Not provided'}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Verified: ${user.isVerified ? 'Yes' : 'No'}`);
        console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
        console.log('   ----------------------------------------');
      });
    } else {
      console.log('   No users found');
    }

    console.log('\n📝 LEAVE REQUESTS TABLE:');
    console.log('==========================================');
    const leaves = await Leave.findAll({
      include: [{
        model: User,
        attributes: ['employeeId', 'fullName', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    if (leaves.length > 0) {
      leaves.forEach((leave, index) => {
        console.log(`${index + 1}. ID: ${leave.id}`);
        console.log(`   Employee: ${leave.User?.fullName || leave.User?.employeeId}`);
        console.log(`   Type: ${leave.leaveType}`);
        console.log(`   From: ${leave.startDate} to ${leave.endDate}`);
        console.log(`   Status: ${leave.status}`);
        console.log(`   Reason: ${leave.reason}`);
        console.log('   ----------------------------------------');
      });
    } else {
      console.log('   No leave requests found');
    }

    console.log('\n📊 DATABASE STATISTICS:');
    console.log('==========================================');
    console.log(`Total Users: ${users.length}`);
    console.log(`Total Leave Requests: ${leaves.length}`);
    console.log(`Verified Users: ${users.filter(u => u.isVerified).length}`);
    console.log(`Admin Users: ${users.filter(u => u.role === 'admin').length}`);
    console.log(`Employee Users: ${users.filter(u => u.role === 'employee').length}`);

  } catch (error) {
    console.error('❌ Error viewing database:', error.message);
  } finally {
    await sequelize.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the function
viewDatabaseData();