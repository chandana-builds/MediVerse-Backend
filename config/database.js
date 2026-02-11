const { Sequelize } = require('sequelize');


const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false
            }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    })

    : new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            host: process.env.DB_HOST || 'mysql.railway.internal', // Fallback to internal host if not set
            port: process.env.DB_PORT || 3306,
            dialect: 'mysql',
            logging: false,
            dialectOptions: {
                ssl: {
                    rejectUnauthorized: false
                }
            },
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        }
    );



module.exports = sequelize;