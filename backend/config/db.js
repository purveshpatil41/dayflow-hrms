import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dialect = process.env.DB_DIALECT || 'mysql';

const sequelizeOptions = {
  dialect,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
};

if (dialect === 'sqlite') {
  sequelizeOptions.storage = process.env.DB_STORAGE || './data/dayflow-local.sqlite';
} else {
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

  Object.assign(sequelizeOptions, {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialectOptions,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
}

const sequelize = new Sequelize(
  process.env.DB_NAME || 'dayflow_hrms',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  sequelizeOptions
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`${dialect} Database Connected Successfully`);
    
    await sequelize.sync({ alter: false });
    console.log('Database Synced');
  } catch (error) {
    console.error('Unable to connect to database:', error.message);
    process.exit(1);
  }
};

export { sequelize, connectDB };
