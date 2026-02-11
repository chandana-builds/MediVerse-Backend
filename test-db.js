
const { Sequelize } = require('sequelize');

// Hardcoded fallback URL for testing
const DB_URL = 'mysql://root:fuRtlnkLEZSvtNFUGrSzeLedgJLObcbo@mysql.railway.internal:3306/railway';

console.log('--- DB CONNECTION TEST (Direct) ---');
console.log('Target URL:', DB_URL);

const sequelize = new Sequelize(DB_URL, {
    dialect: 'mysql',
    logging: console.log,
    dialectOptions: {
        connectTimeout: 10000
    }
});

sequelize.authenticate()
    .then(() => {
        console.log('✅ Connection SUCCESSFUL!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection FAILED:', err.name, err.message);
        // console.error(JSON.stringify(err, null, 2)); // Reduced verbosity
        process.exit(1);
    });
