// config/config.js
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'app_user',
    password: process.env.DB_PASSWORD || 'securepassword',
    database: process.env.DB_NAME || 'user_management',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: true, // Enable logging for development
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false, // Disable logging for production
    dialectOptions: {
      ssl: {
        require: true, // Require SSL for Render PostgreSQL
        rejectUnauthorized: false,
      },
    },
  },
};