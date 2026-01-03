import { Sequelize } from 'sequelize';

// Database configuration with SSL support for cloud databases
const dialectOptions = {
  connectTimeout: 60000,
};

// Add SSL for production (PlanetScale, Railway, etc.)
if (process.env.NODE_ENV === 'production') {
  dialectOptions.ssl = {
    require: true,
    rejectUnauthorized: false
  };
}

const sequelize = new Sequelize(
  process.env.DB_NAME || 'dayflow_hrms',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database Connected Successfully');
    
    await sequelize.sync({ alter: false });
    console.log('Database Synced');
  } catch (error) {
    console.error('Unable to connect to database:', error.message);
    process.exit(1);
  }
};

export { sequelize, connectDB };
