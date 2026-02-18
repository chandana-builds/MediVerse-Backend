const { sequelize, Patient, Doctor, Admin, Ambulance, EmergencyRequest, Prescription } = require('./models');

async function seed() {
    try {
        console.log('Starting MediVerse Data Seeding (Multi-Role)...');

        await sequelize.authenticate();
        await sequelize.sync({ force: true });
        console.log('Database Schema Synced.');

        // 1. Seed Admin
        await Admin.create({
            username: 'admin',
            password: 'admin123',
            role: 'admin'
        });
        console.log('Admin seeded.');

        // 2. Seed Doctor
        const drSarah = await Doctor.create({
            id: 'DOC_001',
            name: 'Dr. Sarah Wilson',
            email: 'sarah.wilson@mediverse.com',
            phone: '+91 98765 43210',
            department: 'Cardiologist',
            password: 'doc123',
            username: 'drsarah'
        });
        console.log('Doctor seeded.');

        // 3. Seed Patient (John)
        const john = await Patient.create({
            name: 'John Doe',
            age: 29,
            phone: '+91 98765 43210',
            address: '123, Health Enclave, Gurgaon',
            username: 'john',
            password: 'password123',
            streak: 0,
            medical_history: ['Mild asthma'],
            location: { lat: 28.4595, lng: 77.0266 }
        });
        console.log('Patient seeded.');

        // 4. Seed Prescription
        await Prescription.create({
            patientId: john.id,
            doctorId: drSarah.id,
            medicines: [
                { name: 'Paracetamol 500mg', morning: true, afternoon: false, night: true },
                { name: 'Vitamin C', morning: true, afternoon: false, night: false }
            ],
            food_advice: 'Avoid spicy food. Drink 3L water daily.',
            exercise_advice: '30 mins brisk walking in morning.'
        });
        console.log('Prescription seeded.');

        // 5. Seed Ambulance
        await Ambulance.create({
            driver_name: 'Rajesh Kumar',
            location: { lat: 28.4595, lng: 77.0266 },
            is_available: true,
        });
        console.log('Ambulance seeded.');

        console.log('MediVerse Multi-Role Seeding Completed Successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding Failed:', error);
        process.exit(1);
    }
}

seed();
