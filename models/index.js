const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Patient = require('./patient');
const Doctor = require('./doctor');
const Admin = require('./admin');
const Prescription = require('./prescription');

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
        type: DataTypes.JSON,
        allowNull: false,
    },
    socket_id: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

const EmergencyRequest = sequelize.define('EmergencyRequest', {
    id: {
        type: DataTypes.INTEGER, // Changed to match create_db.js INT AUTO_INCREMENT
        autoIncrement: true,
        primaryKey: true,
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
        type: DataTypes.STRING,
        defaultValue: 'dispatched',
    }
});

// Relationships
Patient.hasMany(EmergencyRequest, { foreignKey: 'patient_id' });
EmergencyRequest.belongsTo(Patient, { foreignKey: 'patient_id' });

Ambulance.hasMany(EmergencyRequest);
EmergencyRequest.belongsTo(Ambulance);

// Prescription Relationships
Patient.hasMany(Prescription, { foreignKey: 'patientId' });
Prescription.belongsTo(Patient, { foreignKey: 'patientId' });

Doctor.hasMany(Prescription, { foreignKey: 'doctorId' });
Prescription.belongsTo(Doctor, { foreignKey: 'doctorId' });

module.exports = { Patient, Doctor, Admin, Ambulance, EmergencyRequest, Prescription, sequelize };
