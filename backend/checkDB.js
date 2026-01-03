import mysql from 'mysql2/promise';

const checkDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'dayflow_hrms'
    });

    console.log('Checking database tables...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('Tables:', tables);

    console.log('\nChecking leaves table structure...');
    try {
      const [columns] = await connection.execute('DESCRIBE leaves');
      console.log('Leaves table columns:', columns);
    } catch (err) {
      console.log('Leaves table does not exist yet');
    }

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

checkDB();
