const express = require('express');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');

// Import DB and Socket
const { sequelize } = require('./models');
const socket = require('./socket');


const emergencyController = require('./controllers/emergencyController');

const app = express();

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;


// FIX: Relaxed CORS for debugging and ensuring connectivity
app.use(cors({
  origin: true, // Allow all origins reflected
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(express.static('public'));

// Import Controllers
const authController = require('./controllers/authController');
const patientController = require('./controllers/patientController');
const adminController = require('./controllers/adminController');
const prescriptionController = require('./controllers/prescriptionController');


// Initialize Socket.io
const io = socket.init(server);
global.io = io;
global.mockMode = false; // Default to false

// Handle favicon
app.get('/favicon.ico', (req, res) => res.status(204).end());


// FIX: Health Check for Railway Deployment Monitoring
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', mode: (global.mockMode === true) ? 'mock' : 'live' }));


// --- ROUTES ---
app.post('/api/auth/register/patient', authController.registerPatient);
app.post('/api/auth/login/patient', authController.loginPatient);
app.post('/api/auth/register/doctor', authController.registerDoctor);
app.post('/api/auth/login/doctor', authController.loginDoctor);
app.post('/api/auth/login/admin', authController.loginAdmin);

app.post('/api/patient/update', patientController.updatePatientData);
app.post('/api/emergency/trigger', emergencyController.triggerEmergency);
app.get('/api/admin/database', adminController.getAllDatabaseRecords);
app.post('/api/prescription/add', prescriptionController.addPrescription);
app.get('/api/prescription/patient/:patientId', prescriptionController.getPatientPrescriptions);

// Root route for backend status check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'MediVerse Backend',
    mode: global.mockMode ? 'mock' : 'live',
    timestamp: new Date().toISOString()
  });
});

// STARTUP LOGIC
const startServer = async () => {
  try {
    console.log('🔄 Connecting to Database...');
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');
    await sequelize.sync({ alter: true });
    console.log('✅ Models synced.');
    global.mockMode = false;
  } catch (err) {

    console.error('--------------------------------------------------');
    console.error('❌ Database connection failed:', err);
    console.error('⚠️  CRITICAL: Database is required. Exiting...');
    console.error('--------------------------------------------------');
    // Exit process to allow Railway to restart the container or show crash log
    process.exit(1);
  }

  // Start Server - Bound to 0.0.0.0 for Railway/Vercel Connectivity
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 MediVerse Backend live on port ${PORT}`);
    console.log(`ℹ️  Mode: ${global.mockMode ? 'MOCK (Static Data)' : 'LIVE (Database)'}`);

    // Diagnostic info
    const dbHost = process.env.MYSQLHOST || process.env.DB_HOST || 'URL-based';
    console.log(`ℹ️  Target Host: ${dbHost}`);
  });
};

startServer();

// Error Handling to prevent crashing during build/runtime
process.on('unhandledRejection', (err) => console.error('Unhandled Rejection:', err));
process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));
