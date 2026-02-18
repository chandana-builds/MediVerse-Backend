const { Patient, Doctor, Ambulance, EmergencyRequest, Appointment } = require('../models');

exports.getAllDatabaseRecords = async (req, res) => {
    try {
        // In a real app, verify Admin Token here.
        // For MVP, we assume the route is protected or open for demo.

        const patients = await Patient.findAll();
        const doctors = await Doctor.findAll();
        const ambulances = await Ambulance.findAll();
        const emergencies = await EmergencyRequest.findAll();

        // Appointments needs to be extracted from patient JSON or a separate table if we normalized it.
        // In our current schema, appointments are JSON in Patient.
        // But for Admin View, raw data is fine.

        res.json({
            success: true,
            data: {
                patients,
                doctors,
                ambulances,
                emergencies
            }
        });
    } catch (err) {
        console.error("Admin DB View Error:", err);
        res.status(500).json({ success: false, error: 'Failed to fetch database records' });
    }
};
