import bcrypt from 'bcryptjs';
import sequelize from './config/db.js';
import User from './models/User.js';

const testLogin = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected');

    // Test password: "test123"
    const testPassword = 'test123';
    
    // Find user
    const user = await User.findOne({ where: { email: 'ashokkr19@gmail.com' } });
    
    if (!user) {
      console.log('✗ User not found');
      process.exit(1);
    }
    
    console.log('✓ User found:', user.email);
    console.log('  Employee ID:', user.employeeId);
    
    // Hash the test password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testPassword, salt);
    
    // Update user password
    user.password = hashedPassword;
    await user.save();
    
    console.log('✓ Password updated to:', testPassword);
    console.log('  Hash:', hashedPassword);
    
    // Test password matching
    const isMatch = await bcrypt.compare(testPassword, user.password);
    console.log('✓ Password verification:', isMatch ? 'SUCCESS' : 'FAILED');
    
    console.log('\n=====================================');
    console.log('Login credentials:');
    console.log('Email: ashokkr19@gmail.com');
    console.log('Password: test123');
    console.log('=====================================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testLogin();
