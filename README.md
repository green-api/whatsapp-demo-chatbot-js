# whatsapp-demo-chatbot-js

- [Документация на русском](README_RU.md).

An example of a chatbot written in Go using the API service for Whatsapp [green-api.com](https://green-api.com/en/).
The chatbot clearly demonstrates the use of the API to send text messages, files, pictures, locations and contacts.


## Content

* [Installing the environment for running the chatbot](#setting-up-the-environment-for-running-the-chatbot)
* [Launch chatbot](#launch-a-chatbot)
* [Chatbot setup](#setting-up-a-chatbot)
* [Usage](#usage)
* [Code structure](#code-structure)
* [Message management](#message-management)


## Setting up the environment for running the chatbot

To launch the chatbot, you need to install the js environment. If necessary, download and install the latest version of Node.js from [official website](https://nodejs.org/en)

After completion, you need to check whether the environment was deployed correctly. To do this, open a command line (for example, cmd or bash) and enter the query:
```
node -v
```

Download and unzip the [zip-archive](https://github.com/green-api/whatsapp-demo-chatbot-js) of the project or clone it with the version control system command:

<details>
<summary>How to install Git version control?</summary>

Download and install the Git version control system appropriate for your operating system from [official website](https://git-scm.com/downloads).
</details>

```
git clone https://github.com/green-api/whatsapp-demo-chatbot-js
```

Open the project in any IDE.

The environment for launching the chatbot is ready, now you need to configure and launch the chatbot on your Whatsapp account.

## Launch a chatbot

In order to set up a chatbot on your Whatsapp account, you need to go to [your personal account](https://console.greenapi.com/) and register. For new users, [instructions](https://greenapi.com/en/docs/before-start/) are provided for setting up an account and obtaining the parameters necessary for the chatbot to work, namely:
```
    idInstance
    apiTokenInstance
```

After receiving these parameters, find the class [`bot.js`](bot.js) and enter `idInstance` and `apiTokenInstance` into the constant values.
Data initialization is necessary to link the bot with your Whatsapp account:

```javascript
    const bot = new WhatsAppBot({
        idInstance: "{{idInstance}}",
        apiTokenInstance: "{{apiTokenInstance}}",
    })
```

You can then run the program by clicking start in the IDE interface or entering the following query on the command line:
```
    node bot.js
```
This request will start the chatbot. The process begins with chatbot initialization, which includes changing the settings of the associated instance.

The library [whatsapp-chatbot-js](https://github.com/green-api/whatsapp-chatbot-js) contains a mechanism for changing instance settings using the [SetSettings](https://green-api.com/en/docs/api/account/SetSettings/) method, which is launched when the chatbot is turned on.

All settings for receiving notifications are disabled by default; the chatbot will enable the following settings:
```javascript
    let settings = await bot.telegram.restAPI.settings.setSettings({
        incomingWebhook: "yes",
        outgoingMessageWebhook: "yes",
        outgoingAPIMessageWebhook: "yes",
        pollMessageWebhook: "yes",
        markIncomingMessagesReaded: "yes"
    })
```
which are responsible for receiving notifications about incoming and outgoing messages.

The process of changing settings takes several minutes, during which time the instance will be unavailable. Messages sent to the chatbot during this time will not be processed.

After the settings are applied, notifications about previously received incoming messages will be deleted. This process is also written in the library [whatsapp-chatbot-js](https://github.com/green-api/whatsapp-chatbot-js) and starts automatically after changing the settings.

This is necessary so that the chatbot does not start processing messages from old chats.

After changing the settings and deleting incoming notifications, the chatbot will begin to respond to messages as standard. In total, this process takes no more than 5 minutes.

To stop the chatbot, use the keyboard shortcut `Ctrl + C` in the command line.

## Setting up a chatbot

By default, the chatbot uses links to download files from the network, but users can add their own links to files, one for a file of any extension pdf / docx /... and one for a picture.

Links must lead to files from cloud storage or public access. In the scene `endpointsScene` there is the following code to send the file:
```javascript
    endpointsScene.hears(['2'], (ctx) => {
    if (checkSession(ctx)) {
        ctx.telegram.restAPI.file.sendFileByUrl(
            ctx.update.message.chat.id.toString(),
            undefined,
            "https://storage.yandexcloud.net/sw-prod-03-test/ChatBot/corgi.pdf",
            "image.pdf",
            strings.send_file_message[ctx.session.lang] + strings.links[ctx.session.lang].send_file_documentation)
    }
})
```
Add a link to a file of any extension as the first parameter of the `answerWithUrlFile` method and specify the file name in the second parameter. The file name must contain an extension, for example "somefile.pdf".
This line after modification will be in the following format:
```javascript
endpointsScene.hears(['2'], (ctx) => {
    if (checkSession(ctx)) {
        ctx.telegram.restAPI.file.sendFileByUrl(
            ctx.update.message.chat.id.toString(),
            undefined,
            "https://...somefile.pdf",
            "somefile.pdf",
            strings.send_file_message[ctx.session.lang] + strings.links[ctx.session.lang].send_file_documentation)
    }
})
```

All changes must be saved, after which you can launch the chatbot. To launch the chatbot, return to [step 2](#launch-chatbot).

## Usage

If the previous steps have been completed, then the chatbot should be working on your Whatsapp account. It is important to remember that the user must be authorized in [personal account](https://console.green-api.com/).

Now you can send messages to the chatbot!

The chatbot will respond to any message sent to your account.
Since the chatbot supports several languages, before greeting the interlocutor, the chatbot will ask you to select a language of communication:
```
1 - English
2 - Kazakh
3 - Russian
```
Answer with 1, 2 or 3 to select the language for further communication. After you send  1, the chatbot will send a welcome message in English:
```
Welcome to GREEN-API chatbot, user! GREEN-API provides the following types of data sending. Select a number from the list to check how the sending method works

1. Text message 📩
2. File 📋
3. Picture 🖼
4. Audio 🎵
5. Video 📽
6. ...

To return to the beginning write stop or 0
```
By selecting a number from the list and sending it, the chatbot will answer which API sent this type of message and share a link to information about the API.

For example, by sending 1, the user will receive in response:
```
This message was sent via the sendMessage method.

To find out how the method works, follow the link
https://green-api.com/docs/api/sending/SendMessage/
```
If you send something other than numbers 1-13, the chatbot will succinctly answer:
```
Sorry, I didn't quite understand you 😔, write a menu to see possible options
```
The user can also call up the menu by sending a message containing “menu”. And by sending “stop”, the user will end the conversation with the chatbot and receive the message:
```
Thank you for using the GREEN-API chatbot, user!
```

## Code structure
The main file of the chatbot is [`bot.js`](bot.js){:target="_blank"}, it contains the `main` function and program execution begins with it. In this file, the bot object is initialized, the first scene is set, and the bot is launched.

```javascript
async function main() {
     const strings = getStringsData() //Getting data from the strings.yml file in which the bot's replicas are stored
    
     const bot = new WhatsAppBot({ //Initiate a bot object
         idInstance: "{{INSTANCE_ID}}",
         apiTokenInstance: "{{TOKEN}}",
     })

     let settings = await bot.telegram.restAPI.settings.setSettings({ //Set settings so that the bot receives all the necessary webhooks
         incomingWebhook: "yes",
         outgoingMessageWebhook: "yes",
         outgoingAPIMessageWebhook: "yes",
         pollMessageWebhook: "yes",
         markIncomingMessagesReaded: "yes"
     })
     console.log(settings);

     await clearWebhookQueue(bot) //Clears the webhook queue of old notifications so that the bot does not process them
    
     //
     //...Description of scenes
     //
    
     const stage = new Stage([mainMenuScene, endpointsScene, startScene, createGroup]) //Register scenes in the bot state
    
     bot.use(session())
     bot.use(stage.middleware())
     bot.on('message', (ctx) => ctx.scene.enter('startScene')) //Setting the first scene
     launchBotWithErrorHandler(bot) //Launch the bot
}
```

This bot uses scenes to organize its code. This means that the chatbot logic is divided into fragments (scenes), the scene corresponds to a certain state of the dialogue and is responsible for processing the response.

Each chat can only have one scene active at a time.

For example, the first scene `startScene` is responsible for the welcome message. Regardless of the text of the message, the bot asks what language is convenient for the user and includes the following scene, which is responsible for processing the response.

There are 4 scenes in total in the bot:

- Scene `startScene` - responds to any incoming message, sends a list of available languages. Launches the `MainMenu` scene.
- Scene `mainMenuScene` - processes the user's selection and sends the main menu text in the selected language. Launches the `Endpoints` scene
- Scene `endpointsScene` - executes the method selected by the user and sends a description of the method in the selected language.
- Scene `createGroup` - creates a group if the user said that he added a bot to his contacts. If not, returns to the "endpoints" scene.

The `checkSession` method is used to set the start scene again if the bot has not been contacted for more than 2 minutes. It checks how long ago the user touched and if it was more than 5 minutes ago, it updates the session and starts the dialogue again.

The `ymlReader` file contains a function that returns data from the `strings.xml` file. This file is used to store bot replicas.

## Message management

As the chatbot indicates in its responses, all messages are sent via the API. Documentation on message sending methods can be found at [greenapi.com/en/docs/api/sending](https://greenapi.com/en/docs/api/sending/).

As for receiving messages, messages are read through the HTTP API. Documentation on methods for receiving messages can be found at [greenapi.com/docs/en/api/receiving/technology-http-api](https://greenapi.com/en/docs/api/receiving/technology-http-api).

The chatbot uses the library [whatsapp-chatbot-js](https://github.com/green-api/whatsapp-chatbot-js){:target="_blank"}, where methods for sending and receiving messages are already integrated, so messages are read automatically, and sending regular text messages is simplified.

For example, a chatbot automatically sends a message to the contact from whom it received the message:
```javascript
    ctx.reply("text")
```
However, other send methods can be called directly from the [whatsapp-api-client-js](https://github.com/green-api/whatsapp-api-client-js){:target="_blank"} library. Like, for example, when receiving an avatar:
```javascript
    ctx.telegram.restAPI.instance.getAvatar(
        ctx.update.message.from.id.toString(),
        undefined);
```

## License

Licensed under [Creative Commons Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0)](https://creativecommons.org/licenses/by-nd/4.0/).

[LICENSE](https://github.com/green-api/whatsapp-demo-chatbot-js/blob/master/LICENCE).