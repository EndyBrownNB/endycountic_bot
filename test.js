// const CC = require('currency-converter-lt');
// var incur = 'USD';
// var outcur = 'ILS';
// var amount = 632;
// let curcon = new CC({from:incur,to:outcur,amount:amount,isDecimalComma:true});
// curcon.convert().then((res)=>{
//     console.log(res/100)
// })

const fs = require('fs');
const format = require('node.date-time')

function logs(name, log){
    var datetime = new Date().format('Y-M-D H:M:S');
    fs.appendFileSync(`./logs/${name}.log`,`${datetime}  ${log}\n` )
}

function sum(a,b){
    let c = a+b;
    logs('sum', `c = ${c} a = ${a} b = ${b}`)
}

setInterval(sum,2000,1,2)