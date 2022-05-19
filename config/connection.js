// import Sequelize constructor from the library
const Sequelize = require('sequelize');

// do not have to save to a variable; all we need is for it to execute when we use connection.js and all of the data inside the .env file will be made available at process.env.<ENVIRONMENT-VARIABLE-NAME>
require('dotenv').config();

// create connection to database, pass in MYSQL information for username and password 
let sequelize; 
if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306
    });
}

module.exports = sequelize;

// all we are doing here is importing the base Sequelize class and using it to create a new connection to the database; the 'new Sequelize()' function accepts the database name, MYSQL username, and MYSQL password as parameters and then we pass in configuration settings before exporting the connection