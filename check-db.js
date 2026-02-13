
require('dotenv').config();
const { Sequelize } = require('sequelize');

// The same fallback logic as database.js, to test it exactly
const MANUAL_URL = 'mysql://root:hziqQbShuVmUojbMKzKpGeUzCUpujlVM@nozomi.proxy.rlwy.net:41566/railway';

const DB_URL =
    process.env.MYSQL_PUBLIC_URL ||
    process.env.DATABASE_URL ||
    process.env.MYSQL_URL ||
    MANUAL_URL;

console.log('--- Database Connection Diagnostic ---');
console.log('1. Checking Environment Variables:');
console.log('   MYSQL_PUBLIC_URL:', process.env.MYSQL_PUBLIC_URL ? 'Set' : 'Not Set');
console.log('   DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not Set');
console.log('   MYSQL_URL:', process.env.MYSQL_URL ? 'Set' : 'Not Set');
console.log('2. Resolved Connection String:');
console.log('   URL:', DB_URL ? DB_URL.replace(/:[^:@]+@/, ':****@') : 'NONE');

if (!DB_URL) {
    console.error('❌ ERROR: No connection string found. Please set MYSQL_PUBLIC_URL or check database.js');
    process.exit(1);
}

const sequelize = new Sequelize(DB_URL, {
    dialect: 'mysql',
    logging: console.log, // Enable logging to see handshake
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        },
        connectTimeout: 20000
    }
});

async function testConnection() {
    try {
        console.log('3. Attempting Authentication...');
        await sequelize.authenticate();
        console.log('✅ Authentication SUCCESS! Database is reachable.');

        console.log('4. Attempting to Sync Models (checking permissions)...');
        // Just check if we can query strictly
        await sequelize.query('SELECT 1+1 AS result');
        console.log('✅ Query SUCCESS! Database is operational.');

        process.exit(0);
    } catch (error) {
        console.error('❌ CONNECTION FAILED:');
        console.error(error);
        console.log('\n--- Troubleshooting ---');
        console.log('1. If ETIMEDOUT: The Railway TCP Proxy might be blocked or changed.');
        console.log('2. Check if the Port (51130) is still valid in Railway Dashboard.');
        console.log('3. If "Access Denied": Password/User is wrong.');
        process.exit(1);
    }
}

testConnection();
