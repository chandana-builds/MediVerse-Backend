
const { Sequelize } = require('sequelize');

// User-provided Fallback URL (Emergency Access)
const MANUAL_URL = 'mysql://root:fuRtlnkLEZSvtNFUGrSzeLedgJLObcbo@mysql.railway.internal:3306/railway';



// Robust DB Connection String Logic
// Priority: 1. RAILWAY provided vars (MYSQL_URL, DATABASE_URL)
//           2. Hardcoded Fallback (Only if env vars missing)
const DB_URL = process.env.MYSQL_URL || process.env.DATABASE_URL || process.env.MYSQLPUBLIC_URL || MANUAL_URL;

// Debugging: Log the selected URL (Masked)
if (DB_URL) {
    const masked = DB_URL.replace(/:[^:@]+@/, ':****@');
    console.log(`🔌 Database Config: Using Connection String -> ${masked}`);
} else {
    console.error('❌ Database Config: No connection string found!');
}

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
