const { Patient, sequelize } = require('./models');

// Force sync to ensure table exists
async function testRegistration() {
    try {
        console.log('🔄 Syncing Models...');
        await sequelize.sync({ alter: true });
        console.log('✅ Models Synced.');

        const newPatient = {
            name: 'Test Patient',
            age: 30,
            phone: '9998887776',
            address: '123 Test St',
            username: 'testuser_' + Date.now(), // Ensure uniqueness
            password: 'password123',
            email: 'test' + Date.now() + '@example.com'
        };

        console.log('🔄 Attempting to register patient:', newPatient);

        const patient = await Patient.create(newPatient);
        console.log('✅ Registration SUCCESS!');
        console.log('User ID:', patient.id);
        process.exit(0);
    } catch (err) {
        console.error('❌ Registration FAILED:', err);
        if (err.name === 'SequelizeValidationError') {
            console.error('Validation Errors:', err.errors.map(e => e.message));
        }
        process.exit(1);
    }
}

testRegistration();
