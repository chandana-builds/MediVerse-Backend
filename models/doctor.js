const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Doctor = sequelize.define('Doctor', {
    id: {
        type: DataTypes.STRING, // or UUID if you prefer, but create_db.js said VARCHAR(255)
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true
    },
    hospital_name: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Doctor;
