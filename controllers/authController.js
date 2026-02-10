const { Patient, Doctor, Admin } = require('../models');

exports.registerPatient = async (req, res) => {
    try {
        const { name, age, phone, address, username, password, email } = req.body;

        if (!name || !username || !password || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existing = await Patient.findOne({ where: { username } });
        if (existing) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const patient = await Patient.create({
            id: require('crypto').randomUUID(), // Assuming Patient model expects ID
            name, age, phone, address, username, password, email
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
        const { name, email, password, department, hospital_name, phone, username } = req.body;

        if (!name || !email || !password || !username) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existing = await Doctor.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: 'Doctor already registered' });
        }

        const existingUser = await Doctor.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        const doctor = await Doctor.create({
            id: require('crypto').randomUUID(),
            name,
            email,
            username,
            password,
            department: department || 'General',
            hospital_name: hospital_name || 'City Hospital',
            phone
        });

        res.json({ success: true, user: doctor });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.loginDoctor = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Allow login with either username or email
        const doctor = await Doctor.findOne({
            where: {
                [require('sequelize').Op.or]: [{ email: username }, { username: username }]
            }
        });

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
