const WhatsAppBot = require('@green-api/whatsapp-bot')
const {loadStringsYmlFile} = require('../util/ymlReader');

const Scene = WhatsAppBot.BaseScene
const strings = loadStringsYmlFile();

function sendMainMenu(ctx, lang) {
    ctx.session.lang = lang
    ctx.reply(strings.welcome_message[ctx.session.lang] + " " + ctx.update.message.from['first_name'] + "\n" + strings.menu[ctx.session.lang])
    ctx.scene.enter('endpointsScene')
}

const mainMenuScene = new Scene('mainMenuScene')
mainMenuScene.hears(['1'],  (ctx) => {
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

module.exports = { mainMenuScene };