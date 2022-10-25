require('dotenv').config();
const {Telegraf, Scenes, Markup, session} = require('telegraf');
const {Client} = require('pg');
const{enter,leave} = Scenes.Stage

//Объявляю переменные окружения
const token = process.env.APITOKEN;
var host = process.env.HOST
var port = process.env.PORT
var database = process.env.DATABASE
var user =process.env.USER
var pwd = process.env.PWD

//Подключение к БД
var client = new Client({
    host: host,
    port: port,
    database: database,
    user: user,
    password: pwd
})








// Сцены расходов
// export function expflat(){  //Расходы на квартиру

// ..Минусы
//Расходы на продукты
//Расходы на такси
//Расходы на кафе/рестораны
 //Прочие расходы

// ..Плюсы
//Доход с квартиры
//Зарплата

// ..Сцены Отчетов
//Фактическая суммма на руках
//Итоговая сумма, вывод в 3х валютах на : доллары, рубли, местные

module.exports = expfood;