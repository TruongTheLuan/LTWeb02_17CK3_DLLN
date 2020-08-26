const Sequelize = require("sequelize");

// Option 2: Passing parameters separately (other dialects)

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/internetbankingDB' ;
/*
const db = new Sequelize('quanlitodos', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
});
*/
const db = new Sequelize(connectionString);
module.exports = db;