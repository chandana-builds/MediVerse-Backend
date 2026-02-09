const { Prescription, Patient, Doctor } = require('../models');

exports.addPrescription = async (req, res) => {
    try {
        const { patientId, doctorId, medicines, food_advice, exercise_advice } = req.body;

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
        const prescriptions = await Prescription.findAll({
            where: { patientId },
            include: [{ model: Doctor, attributes: ['name', 'specialization'] }],
            order: [['createdAt', 'DESC']]
        });

        res.json({ success: true, prescriptions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
};
