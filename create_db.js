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
        password VARCHAR(255),
        age INT,
        phone VARCHAR(20),
        address TEXT
      )
    `);
        console.log('Patients table ready.');

        // Doctors Table
        await db.query(`
      CREATE TABLE IF NOT EXISTS Doctors (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        department VARCHAR(100),
        hospital_name VARCHAR(255)
      )
    `);
        console.log('Doctors table ready.');

        // EmergencyRequests Table
        await db.query(`
      CREATE TABLE IF NOT EXISTS EmergencyRequests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id VARCHAR(255),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        assigned_hospital VARCHAR(255),
        eta VARCHAR(50),
        status VARCHAR(50) DEFAULT 'dispatched',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('EmergencyRequests table ready.');

        await db.end();
        process.exit(0);
    } catch (err) {
        console.error('Error creating database/tables:', err);
        process.exit(1);
    }
}

createDatabase();
