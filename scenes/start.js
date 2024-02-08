const WhatsAppBot = require('@green-api/whatsapp-bot')
const {loadStringsYmlFile} = require('../util/ymlReader');

const Scene = WhatsAppBot.BaseScene
const strings = loadStringsYmlFile();

const startScene = new Scene('startScene')
startScene.enter( (ctx) => {
    ctx.reply(strings.select_language)
    ctx.scene.enter('mainMenuScene')
})

module.exports = { startScene };