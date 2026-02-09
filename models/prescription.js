const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prescription = sequelize.define('Prescription', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    patientId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    doctorId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    medicines: {
        type: DataTypes.JSON, // Array of { name: 'Para', morning: true, afternoon: false, night: true }
        defaultValue: [],
    },
    food_advice: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    exercise_advice: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
    }
});

module.exports = Prescription;
