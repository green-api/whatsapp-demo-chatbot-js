const {WhatsAppBot} = require('@green-api/whatsapp-bot');
const {loadStringsYmlFile} = require("./util/ymlReader");

const session = WhatsAppBot.session
const Stage = WhatsAppBot.Stage
const Scene = WhatsAppBot.BaseScene
const strings = loadStringsYmlFile()

const bot = new WhatsAppBot({
    idInstance: "1101848919",
    apiTokenInstance: "fe0453b47e1b403c8d88ce881291ea002292b3037ae045bcb2"
})

let settings = bot.telegram.restAPI.settings.setSettings(
    {
        incomingWebhook: "yes",
        outgoingMessageWebhook: "yes",
        outgoingAPIMessageWebhook: "yes"
    });
settings.then(result => {
    console.log(result);
})

function clearWebhookQueue(bot) {
    let notification = bot.telegram.restAPI.webhookService.receiveNotification();
    notification.then(result => {
        if (result === null) {
            console.log("queue empty")
        } else {
            bot.telegram.restAPI.webhookService.deleteNotification(result.receipt);
            console.log("delete " + result.receipt)
            clearWebhookQueue()
        }
    })
}

clearWebhookQueue(bot);

const startScene = new Scene('startScene')
startScene.enter((ctx) => {
    ctx.reply(strings.select_language)
    ctx.scene.enter('mainMenuScene')
})

function sendMainMenu(ctx, lang) {
    ctx.session.lang = lang
    ctx.reply(strings.welcome_message[ctx.session.lang] + " " + ctx.update.message.from['first_name'] + "\n" + strings.menu[ctx.session.lang])
    ctx.scene.enter('endpointsScene')
}

const mainMenuScene = new Scene('mainMenuScene')
mainMenuScene.hears(['1'], (ctx) => {
    sendMainMenu(ctx, "eng");
})
mainMenuScene.hears(['2'], (ctx) => {
    sendMainMenu(ctx, "kz");
})
mainMenuScene.hears(['3'], (ctx) => {
    sendMainMenu(ctx, "ru");
})
mainMenuScene.hears(['4'], (ctx) => {
    sendMainMenu(ctx, "he");
})
mainMenuScene.hears(['5'], (ctx) => {
    sendMainMenu(ctx, "es");
})
mainMenuScene.hears(['6'], (ctx) => {
    sendMainMenu(ctx, "ar");
})
mainMenuScene.on("message", (ctx) => {
    ctx.reply(strings.specify_language)
})


const endpointsScene = new Scene('endpointsScene')
endpointsScene.hears(['1'], (ctx) => {
    ctx.reply("1")
})
endpointsScene.hears(['2'], (ctx) => {
    ctx.reply("2")
})
endpointsScene.hears(['3'], (ctx) => {
    ctx.reply("3")
})
endpointsScene.hears(['4'], (ctx) => {
    ctx.reply("4")
})
endpointsScene.hears(['5'], (ctx) => {
    ctx.reply("5")
})
endpointsScene.hears(['6'], (ctx) => {
    ctx.reply("6")
})
endpointsScene.hears(['7'], (ctx) => {
    ctx.reply("7")
})
endpointsScene.hears(['8'], (ctx) => {
    ctx.reply("8")
})
endpointsScene.hears(['9'], (ctx) => {
    ctx.reply("9")
})
endpointsScene.hears(['10'], (ctx) => {
    ctx.reply("10")
})
endpointsScene.hears(['11'], (ctx) => {
    ctx.reply("11")
})
endpointsScene.hears(['12'], (ctx) => {
    ctx.reply("12")
})
endpointsScene.hears(['stop', 'Stop', 'стоп', 'Стоп'], (ctx) => {
    ctx.reply("stop")
})
endpointsScene.hears(['menu', 'Menu', 'меню', 'Меню'], (ctx) => {
    ctx.reply("menu")
})
endpointsScene.on("message", (ctx) => {
    ctx.reply("error")
})

const stage = new Stage([mainMenuScene, endpointsScene, startScene])
bot.use(session())
bot.use(stage.middleware())
bot.on('message', (ctx) => ctx.scene.enter('startScene'))
bot.launch()