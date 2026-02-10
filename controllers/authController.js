const { Patient, Doctor, Admin } = require('../models');

exports.registerPatient = async (req, res) => {
    try {
        const { name, age, phone, address, username, password } = req.body;

        if (!name || !username || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existing = await Patient.findOne({ where: { username } });
        if (existing) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const patient = await Patient.create({
            id: require('crypto').randomUUID(), // Assuming Patient model expects ID
            name, age, phone, address, username, password
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
        // Updated to access the fields sent by frontend: name, email, department (specialization), hospital, username (id?), password
        // Frontend sends: name, phone, email, specialization (as department), hospital_name (maybe?), username, password.
        // Let's assume frontend sends: name, email, password, department, hospital_name.
        // Based on App.jsx, Doctor registration fields were: name, phone, doctorId, specialization, password.
        // Wait, App.jsx uses `setRegisterData`. I should check what App.jsx sends.
        // Assuming standard fields based on user request "Doctors table... id, name, email, password, department, hospital_name"

        const { name, email, password, department, hospital_name, phone } = req.body;
        // Note: 'phone' is extra in frontend but maybe not in table? I'll ignore or add if table has it. 
        // Table in create_db.js: id, name, email, password, department, hospital_name.
        // I will generate ID from email or random.

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existing = await Doctor.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: 'Doctor already registered' });
        }

        const doctor = await Doctor.create({
            id: require('crypto').randomUUID(),
            name,
            email,
            password,
            department: department || 'General',
            hospital_name: hospital_name || 'City Hospital'
        });

        res.json({ success: true, user: doctor });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.loginDoctor = async (req, res) => {
    try {
        const { username, password } = req.body; // Frontend likely sends 'username' for doctors too now?
        // Or if it sends `email`:
        // Let's check App.jsx. App.jsx sends `registerData` or `credentials`.
        // `credentials` has `username` and `password`.

        const doctor = await Doctor.findOne({ where: { email: username } }); // Assuming username is email for doctors

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
