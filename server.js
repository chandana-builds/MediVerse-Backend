const express = require('express');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');

// Import DB and Socket
const { sequelize } = require('./models');
const socket = require('./socket');
const emergencyController = require('./controllers/emergencyController');

const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.io
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (HTML, CSS, JS)

// Import Controllers
const authController = require('./controllers/authController');
const patientController = require('./controllers/patientController');

// Initialize Socket.io
/*
  We initialize the socket here so that `global.io` or `exports.io` is available
  to controllers and models to emit events.
*/
const io = socket.init(server);
global.io = io; // Expose for controllers

//handle favicon.ico request
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// --- ROUTES ---

// Auth Routes
app.post('/api/auth/register/patient', authController.registerPatient);
app.post('/api/auth/login/patient', authController.loginPatient);
app.post('/api/auth/register/doctor', authController.registerDoctor);
app.post('/api/auth/login/doctor', authController.loginDoctor);
app.post('/api/auth/login/admin', authController.loginAdmin);

// Data Routes
app.post('/api/patient/update', patientController.updatePatientData);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/api/emergency/trigger', emergencyController.triggerEmergency);

// Import additional controllers
const adminController = require('./controllers/adminController');
const prescriptionController = require('./controllers/prescriptionController');

// Admin Routes
app.get('/api/admin/database', adminController.getAllDatabaseRecords);

// Prescription Routes
app.post('/api/prescription/add', prescriptionController.addPrescription);
app.get('/api/prescription/patient/:patientId', prescriptionController.getPatientPrescriptions);

// Database Sync Attempt
/*
  We attempt to authenticate with the database. If it fails (e.g., no Postgres running),
  we log a warning but keep the server running in "Mock Mode" so the frontend can still be tested.
*/
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully.');
    console.log('Database connected successfully.');
    return sequelize.sync({ alter: true }); // Update schema without dropping
  })
  .then(() => {
    console.log('Models synced.');
  })
  .catch(err => {
    console.warn('--------------------------------------------------');
    console.warn('Database connection failed:', err.message);
    console.warn('Server running in MOCK MODE (APIs will return static data).');
    console.warn('--------------------------------------------------');
  });

// Start Server
server.listen(PORT, () => {
  console.log(`MediVerse Backend running on http://localhost:${PORT}`);
});
