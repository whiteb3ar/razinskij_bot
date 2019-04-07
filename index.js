/**
 * This example demonstrates setting up webhook
 * on the Heroku platform.
 */

const TOKEN = process.env.TELEGRAM_TOKEN;
const TelegramBot = require('node-telegram-bot-api');

// Heroku routes from port :443 to $PORT
// Add URL of your app to env variable or enable Dyno Metadata
// to get this automatically
// See: https://devcenter.heroku.com/articles/dyno-metadata
const url = process.env.APP_URL;

const options = {
  webHook: {
    // Port to which you should bind is assigned to $PORT variable
    // See: https://devcenter.heroku.com/articles/dynos#local-environment-variables
    port: process.env.PORT
    // you do NOT need to set up certificates since Heroku provides
    // the SSL certs already (https://<app-name>.herokuapp.com)
    // Also no need to pass IP because on Heroku you need to bind to 0.0.0.0
  }
};

const bot = new TelegramBot(TOKEN, options);

// This informs the Telegram servers of the new webhook.
// Note: we do not need to pass in the cert, as it already provided
bot.setWebHook(`${url}/bot${TOKEN}`);

bot.onText(/\/help(.+)/, function (msg, match) {
    const {
        from: {
            first_name,
            id: chatId
        }
    } = msg;

    const response = [
        `Hey, ${first_name}! I can accept only these commands:`,
        "help - вызов справки"
    ];

    bot.sendMessage(fromId, response.join('\n\t'));
});

bot.onText(/\/echo (.+)/, function (msg, match) {
    var fromId = msg.from.id;
    var resp = match[1];
    bot.sendMessage(fromId, resp);
});

bot.on('message', function (msg, match) {
    bot.sendMessage(msg.chat.id, `Команда не найдена. Используйте "/help" для справки.`);
});