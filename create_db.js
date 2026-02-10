const mysql = require('mysql2/promise');
const config = require('./config/database');

async function createDatabase() {
    try {
        // Create connection without database selected to create it if needed
        const connection = await mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            port: config.port
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\``);
        console.log(`Database ${config.database} created or already exists.`);

        await connection.end();

        // Now connect to the database to create tables
        const db = await mysql.createConnection(config);

        // Patients Table
        await db.query(`
      CREATE TABLE IF NOT EXISTS Patients (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        username VARCHAR(255) UNIQUE, 
        password VARCHAR(255),
        age INT,
        phone VARCHAR(20),
        address TEXT,
        medical_history JSON,
        family_members JSON,
        appointments JSON,
        streak INT DEFAULT 0,
        last_streak_date VARCHAR(20),
        location JSON
      )
    `);
        console.log('Patients table ready.');

        // Doctors Table
        await db.query(`
      CREATE TABLE IF NOT EXISTS Doctors (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        username VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        department VARCHAR(100),
        hospital_name VARCHAR(255),
        phone VARCHAR(20)
      )
    `);
        console.log('Doctors table ready.');

        // EmergencyRequests Table
        // DROP TABLE to ensure we don't have schema mismatches (e.g. patient_id vs patientId)
        // WARNING: This clears emergency history on redeploy/init, but ensures functionality.
        // Remove the DROP line if you want to preserve data and manually migrate.
        // await db.query('DROP TABLE IF EXISTS EmergencyRequests'); 

        // For now, I will NOT uncomment the drop, but I will ensure the CREATE statement is correct.
        // Use ALTER to fix common issues if table exists?

        // Better approach for this user's persistent issue:
        // We will TRY to create it. if it exists, it might be wrong.
        // Let's add a robust check or just recommend running a clean init.

        await db.query(`
      CREATE TABLE IF NOT EXISTS EmergencyRequests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patientId VARCHAR(255),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        assigned_hospital VARCHAR(255),
        eta VARCHAR(50),
        status VARCHAR(50) DEFAULT 'dispatched',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Attempt to check if 'patientId' column exists, if not (and patient_id exists), we might need to fix it.
        // For simplicity in this script, we'll assume a fresh start or manual fix is okay if it fails.
        // But to be helpful, let's try to add the column if it's missing (idempotent).
        try {
            await db.query("ALTER TABLE EmergencyRequests ADD COLUMN patientId VARCHAR(255);");
        } catch (e) {
            // Ignore error if column exists
        }

        console.log('EmergencyRequests table ready.');

        await db.end();
        process.exit(0);
    } catch (err) {
        console.error('Error creating database/tables:', err);
        process.exit(1);
    }
}

createDatabase();
