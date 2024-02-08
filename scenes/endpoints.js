const WhatsAppBot = require('@green-api/whatsapp-bot')
const {loadStringsYmlFile} = require('../util/ymlReader');

const Scene = WhatsAppBot.BaseScene
const strings = loadStringsYmlFile();

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
endpointsScene.hears(['stop','Stop','стоп','Стоп'], (ctx) => {
    ctx.reply("stop")
})
endpointsScene.hears(['menu','Menu','меню','Меню'], (ctx) => {
    ctx.reply("menu")
})
endpointsScene.on("message", (ctx) => {
    ctx.reply("error")
})

module.exports = { endpointsScene };