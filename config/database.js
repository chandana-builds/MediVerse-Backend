
const { Sequelize } = require('sequelize');

// User-provided Fallback URL (Emergency Access)
const MANUAL_URL = 'mysql://root:fuRtlnkLEZSvtNFUGrSzeLedgJLObcbo@mysql.railway.internal:3306/railway';

// Robust DB Connection String Logic
const DB_URL = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQLPUBLIC_URL || process.env.RAILWAY_INTERNAL_URL || MANUAL_URL;

const sequelize = new Sequelize(DB_URL, {
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
        acquire: 60000,
        idle: 10000
    }
});

module.exports = sequelize;
