const {WhatsAppBot} = require('@green-api/whatsapp-bot');
const {getConfigData, configData} = require("./util/config");
const {getStringsData} = require("./util/ymlReader");

const session = WhatsAppBot.session
const Stage = WhatsAppBot.Stage
const Scene = WhatsAppBot.BaseScene

main()

async function main() {
    try {
        const configData = await getConfigData()
        const strings = getStringsData()
        const bot = new WhatsAppBot({
            idInstance: configData.user_id.toString(),
            apiTokenInstance: configData.api_token_id,
        })

        let settings = await bot.telegram.restAPI.settings.setSettings({
            incomingWebhook: "yes",
            outgoingMessageWebhook: "yes",
            outgoingAPIMessageWebhook: "yes"
        });
        console.log(settings);

        await clearWebhookQueue(bot)
        console.log("cleared")


        const startScene = new Scene('startScene')
        startScene.enter( (ctx) => {
            ctx.reply(strings.select_language)
            ctx.scene.enter('mainMenuScene')
        })


        const mainMenuScene = new Scene('mainMenuScene')
        mainMenuScene.hears(['1'], (ctx) => {
            sendMainMenu(ctx, "eng", strings);
        })
        mainMenuScene.hears(['2'], (ctx) => {
            sendMainMenu(ctx, "kz", strings);
        })
        mainMenuScene.hears(['3'], (ctx) => {
            sendMainMenu(ctx, "ru", strings);
        })
        mainMenuScene.hears(['4'], (ctx) => {
            sendMainMenu(ctx, "he", strings);
        })
        mainMenuScene.hears(['5'], (ctx) => {
            sendMainMenu(ctx, "es", strings);
        })
        mainMenuScene.hears(['6'], (ctx) => {
            sendMainMenu(ctx, "ar", strings);
        })
        mainMenuScene.on("message", (ctx) => {
            ctx.reply(strings.specify_language)
        })


        const endpointsScene = new Scene('endpointsScene')
        endpointsScene.hears(['1'], (ctx) => {
            ctx.reply(strings.send_text_message[ctx.session.lang] + strings.links[ctx.session.lang].send_text_documentation)
        })
        endpointsScene.hears(['2'], (ctx) => {
            ctx.telegram.restAPI.file.sendFileByUrl(
                ctx.update.message.chat.id.toString(),
                undefined,
                configData.link_1.toString(),
                "image.pdf",
                strings.send_file_message[ctx.session.lang] + strings.links[ctx.session.lang].send_file_documentation)
        })
        endpointsScene.hears(['3'], (ctx) => {
            ctx.telegram.restAPI.file.sendFileByUrl(
                ctx.update.message.chat.id.toString(),
                undefined,
                configData.link_2.toString(),
                "image.jpg",
                strings.send_image_message[ctx.session.lang] + strings.links[ctx.session.lang].send_file_documentation)
        })
        endpointsScene.hears(['4'], (ctx) => {
            ctx.reply(strings.send_audio_message[ctx.session.lang] + strings.links[ctx.session.lang].send_file_documentation)
            ctx.telegram.restAPI.file.sendFileByUrl(
                ctx.update.message.chat.id.toString(),
                undefined,
                configData.link_3.toString(),
                "audio.mp3",
                strings.send_image_message[ctx.session.lang] + strings.links[ctx.session.lang].send_file_documentation)
        })
        endpointsScene.hears(['5'], (ctx) => {
            ctx.telegram.restAPI.file.sendFileByUrl(
                ctx.update.message.chat.id.toString(),
                undefined,
                configData.link_4.toString(),
                "video.mp4",
                strings.send_video_message[ctx.session.lang] + strings.links[ctx.session.lang].send_file_documentation)
        })
        endpointsScene.hears(['6'], (ctx) => {
            ctx.reply(strings.send_contact_message[ctx.session.lang] + strings.links[ctx.session.lang].send_contact_documentation)

            const contact = {
                firstName: ctx.update.message.from.first_name.toString(),
                lastName: ctx.update.message.from.last_name.toString(),
                phoneContact: parseInt(ctx.update.message.chat.id)
            };
            ctx.telegram.restAPI.message.sendContact(
                ctx.update.message.chat.id.toString(),
                undefined,
                contact
            )
        })
        endpointsScene.hears(['7'], (ctx) => {
            ctx.reply(strings.send_location_message[ctx.session.lang] + strings.links[ctx.session.lang].send_location_documentation)
            ctx.telegram.restAPI.message.sendLocation(
                ctx.update.message.chat.id.toString(),
                35.888171,
                14.440230
            )
        })
        endpointsScene.hears(['8'], (ctx) => {
            ctx.reply(strings.send_poll_message[ctx.session.lang] + strings.links[ctx.session.lang].send_poll_documentation)

            var options = [];
            options.push({optionName: strings.poll_option_1[ctx.session.lang]})
            options.push({optionName: strings.poll_option_2[ctx.session.lang]})
            options.push({optionName: strings.poll_option_3[ctx.session.lang]})

            ctx.telegram.restAPI.message.sendPoll(
                ctx.update.message.chat.id.toString(),
                strings.poll_question[ctx.session.lang].toString(),
                options
            )
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
    } catch (error) {
        console.error("Error in main:", error);
    }
}

async function clearWebhookQueue(bot) {
    let notification = await bot.telegram.restAPI.webhookService.receiveNotification();
    if (notification === null) {
        console.log("queue empty")
    } else {
        await bot.telegram.restAPI.webhookService.deleteNotification(parseInt(notification.receiptId))
        console.log("delete " + notification.receiptId)
        await clearWebhookQueue(bot);
    }
}

function sendMainMenu(ctx, lang, strings) {
    ctx.session.lang = lang
    ctx.reply(strings.welcome_message[ctx.session.lang] + " " + ctx.update.message.from['first_name'] + "\n" + strings.menu[ctx.session.lang])
    ctx.scene.enter('endpointsScene')
}