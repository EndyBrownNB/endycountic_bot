// Получение времени в формате 'YYYY-MM-DD hh:mm:ss
function datenow(){
    var now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth()
    month = month+1;
    if(month<10){
        month = '0'+month
    }
    let day = now.getDate();
    if(day<10){
        day = '0'+day
    }
    let hour = now.getHours();
    if (hour<10){
        hour = '0'+hour
    }
    let minute = now.getMinutes();
    if (minute<10){
        minute = '0'+minute
    }
    let sec = now.getSeconds();
    if (sec<10){
        sec = '0'+sec
    }
    let datka = ''+day+'-'+month+'-'+year+' '+hour+':'+minute+':'+sec;
    return datka
}

const fs = require('fs');
const format = require('node.date-time')

function logs(name, log){
    var datetime = new Date().format('Y-M-D H:M:S');
    fs.appendFileSync(`./logs/${name}.log`,`${datetime}  ${log}\n` )
}



module.exports.datenow = datenow;
module.exports.logs = logs;