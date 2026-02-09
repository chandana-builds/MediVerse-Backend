const mysql = require('mysql2/promise');

async function createDb() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Chinni$1'
        });
        await connection.query('CREATE DATABASE IF NOT EXISTS MediVerrse;');
        console.log('Database "MediVerrse" created or already exists.');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error creating database:', error);
        process.exit(1);
    }
}

createDb();
