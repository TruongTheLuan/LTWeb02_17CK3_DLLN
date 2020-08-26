const Sequelize = require("sequelize");

// Option 2: Passing parameters separately (other dialects)

//luu connection string la bien moi truong hoac mac dinh

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/internetbankingDB' ;
/*
const db = new Sequelize('quanlitodos', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
});
*/
//khai bao sequelize
const db = new Sequelize(connectionString);
//export ra ngoai
module.exports = db;