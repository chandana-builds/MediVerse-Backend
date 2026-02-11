require('dotenv').config();
const { Sequelize } = require('sequelize');

// Fallback ONLY if nothing exists (last option)
const MANUAL_URL =
    'mysql://root:fuRtlnkLEZSvtNFUGrSzeLedgJLObcbo@caboose.proxy.rlwy.net:51130/railway';
// Priority Order
// 1. Railway Public URL (local use)
// 2. Railway Internal URL (deployment)
// 3. DATABASE_URL
// 4. Manual fallback
const DB_URL =
    process.env.MYSQL_PUBLIC_URL ||
    process.env.DATABASE_URL ||
    process.env.MYSQL_URL ||
    MANUAL_URL;

// Debug Masked Log
if (DB_URL) {
    const masked = DB_URL.replace(/:[^:@]+@/, ':****@');
    console.log(`🔌 Using DB URL -> ${masked}`);
} else {
    console.error('❌ No database connection string found!');
}

const sequelize = new Sequelize(DB_URL, {
    dialect: 'mysql',
    logging: false,

    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        },
        connectTimeout: 100000
    },

    pool: {
        max: 5,
        min: 0,
        acquire: 60000,
        idle: 10000
    }
});

// Test connection immediately
sequelize
    .authenticate()
    .then(() => console.log('✅ MySQL Connected Successfully'))
    .catch(err => console.error('❌ DB Connection Failed:', err.message));

module.exports = sequelize;
