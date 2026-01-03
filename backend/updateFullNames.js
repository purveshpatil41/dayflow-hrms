import sequelize from './config/db.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const updateFullNames = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Update users who don't have fullName set
    const [results, metadata] = await sequelize.query(`
      UPDATE users 
      SET fullName = SUBSTRING_INDEX(email, '@', 1)
      WHERE fullName IS NULL OR fullName = ''
    `);

    console.log('Update completed. Rows affected:', metadata.affectedRows || 'Unknown');

    // Display all users
    const users = await User.findAll({
      attributes: ['id', 'employeeId', 'email', 'fullName', 'role'],
    });

    console.log('\nAll users:');
    users.forEach(user => {
      console.log(`ID: ${user.id}, EmpID: ${user.employeeId}, Email: ${user.email}, FullName: ${user.fullName}, Role: ${user.role}`);
    });

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await sequelize.close();
    process.exit(1);
  }
};

updateFullNames();
