import mysql from 'mysql2/promise';

const updateFullNames = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'dayflow_hrms'
    });

    console.log('Connected to database');

    // Update users who don't have fullName set
    console.log('Updating fullName for users who don\'t have it set...');
    const [updateResult] = await connection.execute(`
      UPDATE users 
      SET fullName = SUBSTRING_INDEX(email, '@', 1)
      WHERE fullName IS NULL OR fullName = ''
    `);

    console.log(`Updated ${updateResult.affectedRows} users`);

    // Display all users
    console.log('\nAll users after update:');
    const [users] = await connection.execute(`
      SELECT id, employeeId, email, fullName, role 
      FROM users
      ORDER BY id
    `);

    users.forEach(user => {
      console.log(`ID: ${user.id}, EmpID: ${user.employeeId}, Email: ${user.email}, FullName: ${user.fullName}, Role: ${user.role}`);
    });

    await connection.end();
    console.log('\nDatabase update completed successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
};

updateFullNames();
