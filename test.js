
const func = require('./functions')
const db = require('./dbconn').client;

function rescnt(){
    client.query(`SELECT result FROM public.budget ORDER BY id DESC LIMIT 1`,(err,res) =>{
        if(err) {
            console.log(err.stack);
        }else{
            console.log(`Это:`);
            console.log(res.rows[0].result);
        }
    })
}

    bot.start(async (ctx) =>{
        try{
            await ctx.reply(Markup.inlineKeyboard([
                [{text: 'На такси',callback_data:'expTaxi'}]
            // ['Расход_Такси','Расход_Продукты','Расход_Другое','Расход_Квартира'],
            // ['Доход_зп','Доход_квартира']
        ]))
        } catch(e){
            console.log('Ошибочка!')
        }
    })



//==================
const echoScene = new Scenes.BaseScene('echo')
echoScene.enter((ctx) => ctx.reply('echo scene'))
echoScene.leave((ctx) => ctx.reply('exiting echo scene'))
echoScene.command('back', leave())
echoScene.on('text', (ctx) => ctx.reply(ctx.message.text))
echoScene.on('message', (ctx) => ctx.reply('Only text please'))

//let request = `INSERT INTO public.budget (Rashod_Flat, date, result, username) VALUES (550, '2022-09-01 21:55:31', 1000, Nikita);`
async function scenaExp(ctx,column){
    try{
        await ctx.reply('Введите валюту', Markup.inlineKeyboard(
            [
            [Markup.button.callback('USD','btn_usd'),Markup.button.callback('RUB','btn_rub'),Markup.button.callback('AMD','btn_amd')]
        ]))
    }catch (e) {console.log(e)}

    if(ctx.message.text.match(/^[0-9]*usd$/)){  
        let money = ctx.message.text.match(/^[0-9]*/);
        setdb(column, money)
        await ctx.reply(`Сумма ${money} долларов учтена`)
        await ctx.scene.enter('greeter')
    }
    else if(ctx.message.text.match(/^[0-9]*rub$/)){  
        let money = ctx.message.text.match(/^[0-9]*/);
        let moneyx = money[0]/60
        setdb(column, moneyx)
        await ctx.reply(`Сумма ${money} рублей учтена`)
        await ctx.scene.enter('greeter')
    }
    else if(ctx.message.text.match(/^[0-9]*amd$/)){  
        let money = ctx.message.text.match(/^[0-9]*/);
        let moneyx = money[0]*0.0025
        setdb(column, moneyx)
        await ctx.reply(`Сумма ${money} драмм учтена`)
        await ctx.scene.enter('greeter')
    }else{
        await console.log(ctx.message.text+' не подходит!')
        await ctx.reply(ctx.message.text+' не подходит!')
    }
}