const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Sequelize } = require('sequelize');

// Fallback ONLY if nothing exists (last option)
// NOTE: This manual URL is likely stale. Please ensure DATABASE_URL is set in Railway Variables.
const MANUAL_URL = process.env.MANUAL_DB_URL || null;

const DB_URL =
    process.env.MYSQL_PUBLIC_URL ||
    process.env.DATABASE_URL ||
    process.env.MYSQL_URL ||
    MANUAL_URL;

// Debug Masked Log
if (DB_URL) {
    const masked = DB_URL.replace(/:[^:@]+@/, ':****@');
    console.log(`🔌 Using DB URL -> ${masked}`);

    // CRITICAL: Prevent using API URL as Database URL
    if (DB_URL.startsWith('http://') || DB_URL.startsWith('https://')) {
        console.error('❌ CRITICAL CONFIG ERROR: Your DATABASE_URL or MYSQL_PUBLIC_URL is set to an HTTP URL!');
        console.error('   It MUST be a MySQL connection string starting with "mysql://"');
        console.error('   Please check your Railway Variables and remove the incorrect URL.');
        process.exit(1);
    }
} else {
    console.error('❌ No database connection string found! Please set DATABASE_URL in Railway.');
}

// Detect Railway Environment or Production
const isRailway = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_GIT_COMMIT_SHA || process.env.NODE_ENV === 'production';
const isExternalConnection = DB_URL && (DB_URL.includes('rlwy.net') || DB_URL.includes('railway.app'));

console.log(`🌍 Environment: ${isRailway ? 'Railway/Production' : 'Local/Development'}`);

const sequelize = new Sequelize(DB_URL, {
    dialect: 'mysql',
    logging: false,

    dialectOptions: {
        ssl: (isRailway || isExternalConnection) ? {
            require: true,
            rejectUnauthorized: false
        } : false,
        connectTimeout: 60000
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
