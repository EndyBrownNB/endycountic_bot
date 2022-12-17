const CC = require('currency-converter-lt');
var incur = 'USD';
var outcur = 'ILS';
var amount = 632;
let curcon = new CC({from:incur,to:outcur,amount:amount,isDecimalComma:true});
curcon.convert().then((res)=>{
    console.log(res/100)
})