import dotenv from 'dotenv';
import { sequelize } from './config/db.js';
import User from './models/User.js';
import Leave from './models/Leave.js';

// Load environment variables
dotenv.config();

async function viewLeaves() {
  try {
    console.log('🔍 Viewing Leave Requests...\n');
    
    await sequelize.authenticate();
    
    const leaves = await Leave.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    console.log('📝 LEAVE REQUESTS:');
    console.log('==========================================');
    
    if (leaves.length > 0) {
      leaves.forEach((leave, index) => {
        console.log(`${index + 1}. Leave ID: ${leave.id}`);
        console.log(`   User ID: ${leave.userId}`);
        console.log(`   Type: ${leave.leaveType}`);
        console.log(`   From: ${leave.startDate} to ${leave.endDate}`);
        console.log(`   Status: ${leave.status}`);
        console.log(`   Reason: ${leave.reason}`);
        console.log(`   Created: ${leave.createdAt.toLocaleDateString()}`);
        console.log('   ----------------------------------------');
      });
    } else {
      console.log('   No leave requests found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

viewLeaves();