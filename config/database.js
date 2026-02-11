
const { Sequelize } = require('sequelize');

// Robust DB Connection String Logic
const DB_URL = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQLPUBLIC_URL;

const sequelize = DB_URL
    ? new Sequelize(DB_URL, {
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false
            },
            connectTimeout: 60000 // Increase connection timeout to 60s
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 60000, // Increase acquire timeout to 60s
            idle: 10000
        }
    })

    : new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            host: process.env.DB_HOST || 'mysql.railway.internal', // Fallback to internal host if not set
            port: process.env.DB_PORT || 3306,
            dialect: 'mysql',
            logging: false,
            dialectOptions: {
                ssl: {
                    rejectUnauthorized: false
                },
                connectTimeout: 60000 // Increase connection timeout to 60s
            },
            pool: {
                max: 5,
                min: 0,
                acquire: 60000, // Increase acquire timeout to 60s
                idle: 10000
            }
        }
    );




module.exports = sequelize;