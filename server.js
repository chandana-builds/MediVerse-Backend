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

// FIX: Improved CORS to prevent 'Register Fail' errors on Vercel
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://mediverse-frontend-gamma.vercel.app',
      'http://localhost:3000'
    ];
    // Allow requests with no origin (like mobile apps) or if in allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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

app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

// Database Sync Attempt with Connection Monitoring
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully.');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ Models synced.');
    global.mockMode = false;
  })
  .catch(err => {
    console.warn('--------------------------------------------------');
    console.warn('❌ Database connection failed:', err.message);
    console.warn('⚠️  Check Railway DB_HOST or MYSQL_URL variables.');
    console.warn('⚠️  Server running in MOCK MODE (Static data only).');
    console.warn('--------------------------------------------------');
    global.mockMode = true;
  });

// Error Handling to prevent crashing during build/runtime
process.on('unhandledRejection', (err) => console.error('Unhandled Rejection:', err));
process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));

// Start Server - Bound to 0.0.0.0 for Railway/Vercel Connectivity
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MediVerse Backend live on port ${PORT}`);

  // Debug logging for Mentor verification
  const dbHost = process.env.MYSQLHOST || process.env.DB_HOST || 'URL-based';
  console.log(`ℹ️  Runtime Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`ℹ️  Target Database Host: ${dbHost}`);
});