require('dotenv').config();
const { futimesSync } = require('fs');
const { createConnection } = require('net');
const { CommandCompleteMessage } = require('pg-protocol/dist/messages');
const {Telegraf, Scenes, Markup, session} = require('telegraf');
const{enter,leave} = Scenes.Stage
const func = require('./functions') //тут datenow и пр функции
const client = require('./dbconn').client;//

client.connect()

var currancy ='';

//Объявляю переменные окружения
const token = process.env.APITOKEN;
const bot = new Telegraf(token);

//Описания сцен
//Расходы на квартиру
const expFlat = new Scenes.BaseScene('expFlat')
expFlat.enter((ctx) => ctx.reply(`Введите потраченную на квартиру сумму:`))
expFlat.on('message', async (ctx) => { scenaExp(ctx,'rashod_flat')})

//Расходы на такси
const expTaxi = new Scenes.BaseScene('expTaxi')
expTaxi.enter((ctx) => ctx.reply(`Введите потраченную на такси сумму:`))
expTaxi.on('message', async (ctx) => { scenaExp(ctx,'rashod_taxi')})

//Прочие продукты
const expFood = new Scenes.BaseScene('expFood')
expFood.enter((ctx) => ctx.reply(`Введите потраченную на продукты сумму:`))
expFood.on('message', async (ctx) => { scenaExp(ctx,'rashod_food')})

//Расходы на кафе/рестораны
const expCafe = new Scenes.BaseScene('expCafe')
expCafe.enter((ctx) => ctx.reply(`Введите потраченную на кафе сумму:`))
expCafe.on('message', async (ctx) => { scenaExp(ctx,'rashod_cafe')})

//Прочие расходы
const expOther = new Scenes.BaseScene('expOther')
expOther.enter((ctx) => ctx.reply(`Введите потраченную на что-то другое сумму:`))
expOther.on('message', async (ctx) => { scenaExp(ctx,'rashod_other')})


//Доход с квартиры
const revFlat = new Scenes.BaseScene('revFlat')
revFlat.enter((ctx) => ctx.reply(`Введите полученную за квартиру сумму:`))
revFlat.on('message', async (ctx) => { scenaExp(ctx,'dohod_flat')})

    

//Зарплата
const revSalary = new Scenes.BaseScene('revSalary')
revSalary.enter((ctx) => ctx.reply(`Введите полученную зарплату:`))
revSalary.on('message', async (ctx) => { scenaExp(ctx,'salary')})

//Корректировка - это что-то добавить или вычесть в result
const revCor = new Scenes.BaseScene('revCor')
revCor.enter((ctx) => ctx.reply(`Введите корректирующую сумму:`))
revCor.on('message', async (ctx) => { 
    if (currancy == 'USD'){var mon = ctx.message.text}
    else if (currancy == 'RUB'){var mon = ctx.message.text/60}
    else if (currancy == 'AMD'){var mon = Number(ctx.message.text)*(0,0025)}
    client.query(`SELECT result FROM public.budget ORDER BY id DESC LIMIT 1`,(err,res) =>{
        let result = Number(res.rows[0].result) + Number(mon);
        var text = `INSERT INTO public.budget (correction, Date, result, username) VALUES (${mon}, '${func.datenow()}', ${result}, '${ctx.chat.first_name}');`
            client.query(text,(err)=>{
                if (err){console.log(err)}
                else {
                    if (mon < 0){
                        let summ = ctx.message.text.replace('-','')
                        console.log('summ: '+summ)
                        ctx.reply(`Сумма ${summ} вычтена`);
                        crnc(ctx);
                    }else if (mon > 0){
                        ctx.reply(`Сумма ${ctx.message.text} добавлена`);
                        crnc(ctx);
                    }
                }
             })
    })
})

//На руках - это запись в InFact
const inFact = new Scenes.BaseScene('inFact')
inFact.enter((ctx) => ctx.reply(`Введите сумму, имеющуюся на руках:`))
inFact.on('message', async (ctx) => {
    if (currancy == 'USD'){var mon = ctx.message.text}
    else if (currancy == 'RUB'){var mon = ctx.message.text/60}
    else if (currancy == 'AMD'){var mon = Number(ctx.message.text)*0.0025}
        client.query(`SELECT id FROM public.budget ORDER BY id DESC LIMIT 1`,(err,res)=>{
            if (err) {console.log(err)}
            else{
                let id = res.rows[0].id;
                client.query(`UPDATE public.budget SET in_fact=${mon} WHERE id=${id}`,(err) =>{
                    if (err) {console.log('====')}
                    else {ctx.reply(`У вас на руках ${mon} USD`)
                    crnc(ctx)
                    }   
                })
            }
        })
})


const stage = new Scenes.Stage([expFood,expTaxi,expFlat,expCafe,expOther,revFlat,revSalary,revCor,inFact], {ttl:10})
bot.use(session())
bot.use(stage.middleware())

bot.start(async (ctx) =>{
    await ctx.reply('Начало', Markup.keyboard([['/start']]))
    await crnc(ctx)
})

bot.action('btn_taxi', async (ctx) => {
    try{
    ctx.scene.enter('expTaxi')
    } catch(e){console.log(e)}
})
bot.action('btn_food', async (ctx) => {
    try{
    ctx.scene.enter('expFood')
    } catch(e){console.log(e)}
})
bot.action('btn_flat', async (ctx) => {
    try{
    ctx.scene.enter('expFlat')
    } catch(e){console.log(e)}
})
bot.action('btn_cafe', async (ctx) => {
    try{
    ctx.scene.enter('expCafe')
    } catch(e){console.log(e)}
})
bot.action('btn_other', async (ctx) => {
    try{
    ctx.scene.enter('expOther')
    } catch(e){console.log(e)}
})

bot.action('btn_slr', async (ctx) => {
    try{
    ctx.scene.enter('revSalary')
    } catch(e){console.log(e)}
})
bot.action('btn_revflat', async (ctx) => {
    try{
    ctx.scene.enter('revFlat')
    } catch(e){console.log(e)}
})
bot.action('btn_crtn', async (ctx) => {
    try{
    ctx.scene.enter('revCor')
    } catch(e){console.log(e)}
})
bot.action('btn_infact', async (ctx) => {
    try{
    ctx.scene.enter('inFact')
    } catch(e){console.log(e)}
})

bot.action('btn_usd', async (ctx) => {
    try{currancy = 'USD';
    starter(ctx)
    } catch(e){console.log(e)}
    })
bot.action('btn_rub', async (ctx) => {
    try{currancy = 'RUB';
    starter(ctx)
    } catch(e){console.log(e)}
    })
bot.action('btn_amd', async (ctx) => {
    try{currancy = 'AMD';
    starter(ctx)
    } catch(e){console.log(e)}
    })


// Кнопки различных отчетов
bot.action('btn_repUSD', async (ctx) => {
    try{
        client.query(`SELECT result FROM public.budget ORDER BY id DESC LIMIT 1`,(err, res)=>{
            if (err){console.log(err)}
            else {
                ctx.reply(`Ваш рассчетный остаток ${res.rows[0].result} USD`)
                crnc(ctx)
            }
        })
    } catch(e){console.log(e)}
    })

bot.action('btn_repRUB', async (ctx) => {
    try{
        client.query(`SELECT result FROM public.budget ORDER BY id DESC LIMIT 1`,(err, res)=>{
            if (err){console.log(err)}
            else {
                let ans = Number(res.rows[0].result)*60
                console.log(err)
                ctx.reply(`Ваш рассчетный остаток ${ans} RUB`)
                crnc(ctx)
            }
        })
    } catch(e){console.log(e)}
    })
bot.action('btn_repAMD', async (ctx) => {
    try{
        client.query(`SELECT result FROM public.budget ORDER BY id DESC LIMIT 1`,(err, res)=>{
            if (err){console.log(err)}
            else {
                let ans = Number(res.rows[0].result)/(0.0025)
                ctx.reply(`Ваш рассчетный остаток ${ans} AMD`)
                crnc(ctx)
            }
        })
    } catch(e){console.log(e)}
    })
bot.action('btn_differ', async (ctx) => {
    try{
        client.query(`SELECT (in_fact-result) as differ FROM public.budget ORDER BY id DESC LIMIT 1`,(err, res)=>{
            if (err){console.log(err)}
            else if(res.rows[0].differ==null) {
                ctx.reply(`${ctx.chat.first_name} сначала введите сумму имеющуюся у вас на руках`)
                ctx.scene.enter('inFact')
            }
            else if(res.rows[0].differ > 0) {
                ctx.reply(`${ctx.chat.first_name}, у вас на руках больше денег, чем ожидалось на ${res.rows[0].differ} USD`)
                crnc(ctx)
            }
            else if(res.rows[0].differ < 0) {
                let mod = res.rows[0].differ.replace('-','')
                ctx.reply(`${ctx.chat.first_name}, у вас на руках меньше денег, чем ожидалось на ${mod} USD`)
                crnc(ctx)
            }
            else {
                ctx.reply(`${ctx.chat.first_name}, фактическая и рассчетная суммы сошлись!`)
                crnc(ctx)
            }
        })
    } catch(e){console.log(e)}
    })

bot.launch()
console.log('Bot started..')
console.log(func.datenow())


//=========================================Functions====================================================
//Функция сцена для расходов !!!!!! В дальнейшем добавить уточнение на валюту кнопкой!

// Реализовать пересчет в доллары через API!!
async function scenaExp(ctx,column){
    if(currancy =='USD'){  
        let money = ctx.message.text.match(/^[0-9]*/);
        setdb(column, money, ctx)
        await ctx.reply(`${ctx.chat.first_name}, Сумма ${money} долларов учтена`)
        crnc(ctx)
    }
    else if(currancy =='RUB'){  
        let money = ctx.message.text.match(/^[0-9]*/);
        let moneyx = money[0]/60
        setdb(column, moneyx, ctx)
        await ctx.reply(`${ctx.chat.first_name}, Сумма ${money} рублей учтена`)
        crnc(ctx)
    }
    else if(currancy =='AMD'){  
        let money = ctx.message.text.match(/^[0-9]*/);
        let moneyx = money[0]*0.0025
        setdb(column, moneyx, ctx)
        await ctx.reply(`${ctx.chat.first_name}, Сумма ${money} драмм учтена`)
        crnc(ctx)
        //await ctx.scene.enter('greeter')
    }else{
        await console.log(ctx.message.text+' не подходит!')
        await ctx.reply(ctx.message.text+' не подходит!')
        await ctx.reply(currancy +' Вводимая валюта')
    }
}

//Функция записать новую строку в БД===

async function getdb(req,column){
    client.query(req,(err,res) =>{
        if(err) {
            console.log(err.stack);
        }else{
            console.log(res.rows[0].result);
        }
    })
}

async function setdb(column,moneyx,ctx){

    client.query(`SELECT result FROM public.budget ORDER BY id DESC LIMIT 1`,(err,res) =>{
        var lastname = ctx.chat.first_name
        console.log(typeof(lastname))
        if(err) {
            console.log(err.stack);
        }else{
            console.log('Result setdb: '+res.rows[0].result);
            if((column == 'rashod_flat')||(column == 'rashod_food')||(column == 'rashod_taxi')||(column == 'rashod_cafe')||(column == 'rashod_other')){
                var result = res.rows[0].result - moneyx;
            }else if ((column == 'salary')||(column == 'dohod_flat')){
                var result = Number(res.rows[0].result) + Number(moneyx);
            }
            var text = `INSERT INTO public.budget (${column}, Date, result, username) VALUES (${moneyx}, '${func.datenow()}', ${result}, '${ctx.chat.first_name}');`
            client.query(text,(err) =>{
                if(err) {
                    console.log(err);
                }else{
                    console.log(`Запись выполнена`);
                }
            })
        }
    })
}

//Страртовый набор кнопок
async function starter(ctx){
try{
    await ctx.reply('Категории расхода:', Markup.inlineKeyboard(
        [
        [Markup.button.callback('На такси','btn_taxi'),Markup.button.callback('На еду','btn_food'),
        Markup.button.callback('На жильё','btn_flat')],[Markup.button.callback('На кафе','btn_cafe'),
        Markup.button.callback('На другое','btn_other')]
    ]))
    await ctx.reply('Категории дохода:', Markup.inlineKeyboard(
        [
        [Markup.button.callback('Зарплата','btn_slr'),Markup.button.callback('Квартира','btn_revflat')],
        [Markup.button.callback('Корректировка','btn_crtn'),Markup.button.callback('Реально на руках','btn_infact')]
    ]))
    await ctx.reply('Тип отчета:', Markup.inlineKeyboard(
        [
        [Markup.button.callback('В долларах','btn_repUSD'),Markup.button.callback('В рублях','btn_repRUB'),
        Markup.button.callback('В драмах','btn_repAMD')],[Markup.button.callback('Разница','btn_differ')]
    ]))
} catch(e){
    console.log(e)
}
}

async function crnc(ctx){
    await ctx.reply('С какой валютой работаем?', Markup.inlineKeyboard(
    [
        [Markup.button.callback('USD','btn_usd'),Markup.button.callback('RUB','btn_rub'),
        Markup.button.callback('AMD','btn_amd')]
]))}