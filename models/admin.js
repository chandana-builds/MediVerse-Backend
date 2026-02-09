const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
    role: {
        type: DataTypes.STRING,
        defaultValue: 'admin',
    }
});

module.exports = Admin;
