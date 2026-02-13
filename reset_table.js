const { sequelize, EmergencyRequest } = require('./models');

async function resetTable() {
    try {
        console.log('🔄 Connecting to Database for Emergency Table Reset...');
        await sequelize.authenticate();
        console.log('✅ Connected.');

        console.log('⚠️  Dropping and Recreating EmergencyRequest table...');
        // Force sync ONLY for this model to clear "Too many keys" error
        await EmergencyRequest.sync({ force: true });

        console.log('✅ EmergencyRequest table reset successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error resetting table:', err);
        process.exit(1);
    }
}

resetTable();
