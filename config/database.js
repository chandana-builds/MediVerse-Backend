const { Sequelize } = require('sequelize');

// Updated with MySQL credentials provided by the user
const sequelize = new Sequelize('MediVerrse', 'root', 'Chinni$1', {
    host: 'localhost', // User mentioned host:Admin but usually local is localhost. I'll try localhost first.
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize;
