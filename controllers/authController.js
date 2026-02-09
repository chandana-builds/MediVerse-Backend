const { Patient, Doctor, Admin } = require('../models');

exports.registerPatient = async (req, res) => {
    try {
        const { name, age, phone, address, username, password } = req.body;

        // Basic validation
        if (!name || !username || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check availability
        const existing = await Patient.findOne({ where: { username } });
        if (existing) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const patient = await Patient.create({
            name, age, phone, address, username, password // In prod, hash password!
        });

        res.json({ success: true, user: patient });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.loginPatient = async (req, res) => {
    try {
        const { username, password } = req.body;
        const patient = await Patient.findOne({ where: { username } });

        if (!patient || patient.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ success: true, user: patient });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.registerDoctor = async (req, res) => {
    try {
        const { name, phone, doctorId, specialization, password } = req.body;

        if (!name || !doctorId || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existing = await Doctor.findOne({ where: { doctorId } });
        if (existing) {
            return res.status(400).json({ error: 'Doctor ID already exists' });
        }

        const doctor = await Doctor.create({
            name, phone, doctorId, specialization, password
        });

        res.json({ success: true, user: doctor });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.loginDoctor = async (req, res) => {
    try {
        const { doctorId, password } = req.body;
        const doctor = await Doctor.findOne({ where: { doctorId } });

        if (!doctor || doctor.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ success: true, user: doctor });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ where: { username } });

        if (!admin || admin.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ success: true, user: admin });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
