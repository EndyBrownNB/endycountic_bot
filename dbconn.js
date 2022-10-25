require('dotenv').config();
const {Client} = require('pg')

var host = process.env.HOST
var port = process.env.PORT
var database = process.env.DATABASE
var user =process.env.USER
var pwd = process.env.PWD

//Подключение к БД
const client = new Client({
    host: host,
    port: port,
    database: database,
    user: user,
    password: pwd
})


module.exports.client = client;
