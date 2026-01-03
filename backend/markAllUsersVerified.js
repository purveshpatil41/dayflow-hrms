import { connectDB } from './config/db.js';
import User from './models/User.js';

const markAllUsersVerified = async () => {
  try {
    await connectDB();
    
    console.log('Marking all users as verified...');
    
    const updateResult = await User.update(
      { 
        isVerified: true,
        verificationToken: null,
        otp: null,
        otpExpiry: null
      },
      { 
        where: {} // Update all users
      }
    );
    
    console.log(`Updated ${updateResult[0]} users to verified status`);
    
    const allUsers = await User.findAll({
      attributes: ['id', 'fullName', 'email', 'employeeId', 'isVerified']
    });
    
    console.log('\nAll users:');
    allUsers.forEach(user => {
      console.log(`- ${user.fullName} (${user.email}) - Employee ID: ${user.employeeId} - Verified: ${user.isVerified}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error marking users as verified:', error);
    process.exit(1);
  }
};

markAllUsersVerified();