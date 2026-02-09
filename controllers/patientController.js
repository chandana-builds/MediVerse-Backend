const { Patient } = require('../models');

exports.updatePatientData = async (req, res) => {
    try {
        const { username, ...updates } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Username required' });
        }

        const patient = await Patient.findOne({ where: { username } });
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Update fields
        Object.assign(patient, updates);
        await patient.save();

        res.json({ success: true, user: patient });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
