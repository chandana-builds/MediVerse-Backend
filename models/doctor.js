const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Doctor = sequelize.define('Doctor', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    doctorId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    specialization: {
        type: DataTypes.STRING,
        defaultValue: 'General Physician',
    },
    password: {
        type: DataTypes.STRING, // In production, hash this!
        allowNull: false,
    },
});

module.exports = Doctor;
