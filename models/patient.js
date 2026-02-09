const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Patient = sequelize.define('Patient', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING, // In production, hash this!
        allowNull: false,
    },
    medical_history: {
        type: DataTypes.JSON, // Stores history as JSON
        defaultValue: [],
    },
    family_members: {
        type: DataTypes.JSON, // Stores family contacts as JSON
        defaultValue: [],
    },
    appointments: {
        type: DataTypes.JSON, // Stores appointments as JSON
        defaultValue: [],
    },
    streak: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    last_streak_date: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    location: {
        type: DataTypes.JSON, // { lat: ..., lng: ... } 
        allowNull: true,
    },
});

module.exports = Patient;
