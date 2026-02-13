const { Sequelize } = require('sequelize');
const sequelize = require('./config/database');

async function createDatabase() {
  try {
    console.log('🔄 Initializing Database Tables...');

    // Sync all defined models to the database
    await sequelize.sync({ alter: true });

    console.log('✅ Tables created/updated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error initializing database:', err);
    process.exit(1);
  }
}

createDatabase();
