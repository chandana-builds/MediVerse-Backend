const { Patient, Ambulance, sequelize } = require('./models');

async function seed() {
    try {
        await sequelize.sync({ force: true }); // Reset DB for clean state

        // 1. Seed Patient
        await Patient.create({
            name: 'John Doe',
            age: 30,
            phone: '1234567890',
            address: '123 Main St',
            username: 'john',
            password: 'password123', // In real app, this should be hashed
            medical_history: 'Hypertension, Allergic to Penicillin',
            streak: 4,
            family: [
                { name: 'Jane Doe', phone: '0987654321' }
            ]
        });

        // 2. Seed Ambulances
        await Ambulance.bulkCreate([
            {
                driver_name: 'Rajesh Kumar',
                is_available: true,
                location: { lat: 28.4595, lng: 77.0266 }, // Gurgaon
                socket_id: null
            },
            {
                driver_name: 'Suresh Singh',
                is_available: true,
                location: { lat: 28.5355, lng: 77.3910 }, // Noida
                socket_id: null
            },
            {
                driver_name: 'Amit Patel',
                is_available: false, // Busy
                location: { lat: 28.6139, lng: 77.2090 }, // Delhi
                socket_id: null
            }
        ]);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
}

seed();
