const { Patient, Ambulance, EmergencyRequest, sequelize } = require('../models');
const { io } = require('../socket'); // We will create this wrapper

exports.triggerEmergency = async (req, res) => {
    const { patientId, location } = req.body; // location: { lat, lng }

    try {
        // 1. Find Patient & Validate
        const patient = await Patient.findByPk(patientId);
        if (!patient) return res.status(404).json({ error: 'Patient not found' });

        // 2. Create Request
        const request = await EmergencyRequest.create({
            PatientId: patientId,
            status: 'PENDING',
            pickup_location: { type: 'Point', coordinates: [location.lat, location.lng] } // Note: PostGIS usually uses [long, lat]
        });

        // 3. Find Nearest Available Ambulance
        // Using simple distance calculation for MVP, logic can be upgraded to PostGIS ST_Distance
        const ambulances = await Ambulance.findAll({ where: { is_available: true } });

        if (ambulances.length === 0) {
            return res.status(503).json({ error: 'No ambulances available.' });
        }

        // Simple Euclidean distance for MVP (mocking nearest)
        // accessible since we requested 'lat' 'lng'
        let nearest = ambulances[0];
        // ... insert distance calculation logic here ...

        if (nearest) {
            // 4. Assign
            await request.update({ status: 'ASSIGNED', AmbulanceId: nearest.id });
            await nearest.update({ is_available: false });

            // 5. Notify Ambulance Driver (via Socket)
            if (global.io) {
                global.io.to(nearest.socket_id).emit('emergency_assigned', {
                    requestId: request.id,
                    patientName: patient.name,
                    location: location,
                    medicalHistory: patient.medical_history, // CRITICAL: Sending history
                });
            }

            return res.json({
                status: 'ASSIGNED',
                ambulance: {
                    id: nearest.id,
                    driver: nearest.driver_name,
                    eta: '10 mins'
                }
            });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
