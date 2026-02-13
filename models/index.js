const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Import model definitions
const Patient = require('./patient');
const Doctor = require('./doctor');
const Admin = require('./admin');
const Prescription = require('./prescription');

// Define Ambulance Model
const Ambulance = sequelize.define('Ambulance', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    driver_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    location: {
        type: DataTypes.JSON, // Stores current latitude/longitude
        allowNull: false,
    },
    socket_id: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

// Define EmergencyRequest Model
const EmergencyRequest = sequelize.define('EmergencyRequest', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    patientId: {
        type: DataTypes.UUID, // Changed from INTEGER to match Patient.id (UUID)
        allowNull: true,
    },

    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false
    },
    assigned_hospital: {
        type: DataTypes.STRING,
        allowNull: true
    },
    eta: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('dispatched', 'en-route', 'completed', 'cancelled'),
        defaultValue: 'dispatched',
    },
    // Explicitly define foreign key to prevent "Duplicate column" error during sync
    ambulanceId: {
        type: DataTypes.UUID,
        allowNull: true
    }
});

// --- RELATIONSHIPS ---

// Emergency & Patient
Patient.hasMany(EmergencyRequest, { foreignKey: 'patientId' });
EmergencyRequest.belongsTo(Patient, { foreignKey: 'patientId' });

// Emergency & Ambulance
Ambulance.hasMany(EmergencyRequest, { foreignKey: 'ambulanceId' });
EmergencyRequest.belongsTo(Ambulance, { foreignKey: 'ambulanceId' });

// Prescription & Patient
Patient.hasMany(Prescription, { foreignKey: 'patientId' });
Prescription.belongsTo(Patient, { foreignKey: 'patientId' });

// Prescription & Doctor
Doctor.hasMany(Prescription, { foreignKey: 'doctorId' });
Prescription.belongsTo(Doctor, { foreignKey: 'doctorId' });

// Export everything as a single object
module.exports = {
    Patient,
    Doctor,
    Admin,
    Ambulance,
    EmergencyRequest,
    Prescription,
    sequelize
};