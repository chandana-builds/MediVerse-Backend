const { Prescription, Patient, Doctor } = require('../models');


exports.addPrescription = async (req, res) => {
    try {
        const { patientId, doctorId, medicines, food_advice, exercise_advice } = req.body;

        if (global.mockMode) {
            return res.json({
                success: true,
                prescription: { id: 'mock-pres-id', ...req.body }
            });
        }

        const prescription = await Prescription.create({

            patientId,
            doctorId,
            medicines, // JSON Array
            food_advice,
            exercise_advice
        });

        res.json({ success: true, prescription });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add prescription' });
    }
};


exports.getPatientPrescriptions = async (req, res) => {
    try {
        const { patientId } = req.params;

        if (global.mockMode) {
            return res.json({
                success: true,
                prescriptions: [
                    {
                        id: 'mock-p1',
                        medicines: [{ name: 'Paracetamol', dosage: '500mg' }],
                        food_advice: 'Drink water',
                        exercise_advice: 'Rest',
                        createdAt: new Date(),
                        Doctor: { name: 'Dr. Mock', specialization: 'General' }
                    }
                ]
            });
        }

        const prescriptions = await Prescription.findAll({
            where: { patientId },
            include: [{ model: Doctor, attributes: ['name', 'department'] }], // Changed 'specialization' to 'department' to match Doctor model
            order: [['createdAt', 'DESC']]
        });

        res.json({ success: true, prescriptions });
    } catch (err) {
        console.error("Get Prescriptions Error:", err);
        res.status(500).json({ success: false, error: 'Failed to fetch prescriptions' });
    }
};
