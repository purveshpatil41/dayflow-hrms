import mysql from 'mysql2/promise';

const testAccountDeletion = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'dayflow_hrms'
    });

    console.log('Connected to database');

    // Show all users before
    console.log('\n=== USERS BEFORE DELETION ===');
    const [usersBefore] = await connection.execute(`
      SELECT id, employeeId, email, fullName, role 
      FROM users
      ORDER BY id
    `);

    usersBefore.forEach(user => {
      console.log(`ID: ${user.id}, EmpID: ${user.employeeId}, Email: ${user.email}, FullName: ${user.fullName}, Role: ${user.role}`);
    });

    // For testing, let's create a test user and then delete it
    console.log('\n=== CREATING TEST USER ===');
    const [insertResult] = await connection.execute(`
      INSERT INTO users (fullName, employeeId, email, password, role, isVerified, createdAt, updatedAt)
      VALUES ('Test User', 'TEST001', 'test@delete.com', '$2b$10$hashedPassword', 'Employee', 1, NOW(), NOW())
    `);

    const testUserId = insertResult.insertId;
    console.log(`Created test user with ID: ${testUserId}`);

    // Now delete the test user
    console.log('\n=== DELETING TEST USER ===');
    const [deleteResult] = await connection.execute(`
      DELETE FROM users WHERE id = ?
    `, [testUserId]);

    console.log(`Deleted ${deleteResult.affectedRows} user(s)`);

    // Show all users after
    console.log('\n=== USERS AFTER DELETION ===');
    const [usersAfter] = await connection.execute(`
      SELECT id, employeeId, email, fullName, role 
      FROM users
      ORDER BY id
    `);

    usersAfter.forEach(user => {
      console.log(`ID: ${user.id}, EmpID: ${user.employeeId}, Email: ${user.email}, FullName: ${user.fullName}, Role: ${user.role}`);
    });

    await connection.end();
    console.log('\n✅ Database deletion test completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testAccountDeletion();