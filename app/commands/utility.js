"use strict";

const rp = require("request-promise"),
    h2p = require("html2plaintext"),
    moment = require("moment"),
    database = require("../database"),
    { WaniKani } = require("../helpers/wanikani"),
    { Wikipedia } = require("../helpers/wikipedia"),
    Yandex = require("../helpers/yandex");

const translate = async (context, sender_psid, params) => {
    let [lang, ...text] = params.split(" ");
    text = text.join(" ");

    if(!lang || !text) {
        await context.send.sendText(sender_psid, "Enter the destination language and the text you want to translate. (Example: !translate en こんにちは)");
        return;
    }

    try {
        await context.send.sendTypingIndicator(sender_psid, true);

        const translate = new Yandex.Translate(context.config.YANDEX_TRANSLATE_KEY),
            translation = await translate.translate(lang, text);

        await context.send.sendText(sender_psid, `${translation.text[0]}\n\nPowered by Yandex.Translate`);
    } catch(err) {
        await context.send.sendText(sender_psid, "Unable to translate text, please try again later.");
    } finally {
        await context.send.sendTypingIndicator(sender_psid, false);
    }
};

const wikipedia = async (context, sender_psid, params) => {
    if(!params || !/\S/.test(params)) {
        await context.send.sendText(sender_psid, "Enter the name of the article to look up. (Example: !wikipedia Nisio Isin)");
        return;
    }

    try {
        await context.send.sendTypingIndicator(sender_psid, true);

        const wikipedia = new Wikipedia(),
            articles = await wikipedia.query(params);

        if(articles.query.search.length === 0) {
            await context.send.sendText(sender_psid, "No articles with specified title found.");
            return;
        }

        const article = await wikipedia.parse(articles.query.search[0].title),
            text = h2p(article.parse.text["*"]);

        await context.send.sendText(sender_psid, text);
    } catch(err) {
        console.log(err);
        await context.send.sendText(sender_psid, "Unable to get article from Wikipedia, please try again later.");
    } finally {
        await context.send.sendTypingIndicator(sender_psid, false);
    }
};

const weather = async (context, sender_psid, params) => {
    if(!/[0-9]+,[a-zA-Z]{2}$/.test(params)) {
        await context.send.sendText(sender_psid, "Enter your ZIP code and 2-letter country code. (Example: !weather 4024,ph)");
        return;
    }

    try {
        await context.send.sendTypingIndicator(sender_psid, true);

        const weather = await rp.get({
            uri: "https://api.openweathermap.org/data/2.5/weather",
            json: true,
            qs: {
                zip: params,
                appid: context.config.OPENWEATHERMAP_KEY
            }
        });

        await context.send.sendText(sender_psid, `${weather.name} Weather\nType: ${weather.weather[0].main} (${weather.weather[0].description})\nTemperature: ${weather.main.temp - 273.15}C`);
    } catch(err) {
        await context.send.sendText(sender_psid, "Unable to get weather data from OpenWeatherMap, please try again later.");
    } finally {
        await context.send.sendTypingIndicator(sender_psid, false);
    }
};

const callme = async (context, sender_psid, params) => {
    try {
        await database.setNickname(sender_psid, params);
        await context.send.sendText(sender_psid, params ? `I will now call you ${params}!` : "You removed your nickname.");
    } catch(err) {
        console.log(err);
        await context.send.sendText(sender_psid, "I'm currently unable to set your nickname, please try again later.");
    }
};

const google = async (context, sender_psid, params) => {
    if(!params || !/\S/.test(params)) {
        await context.send.sendText(sender_psid, "Enter your search terms. (Example: !google Nisio Isin)");
        return;
    }

    try {
        await context.send.sendTypingIndicator(sender_psid, true);

        const options = {
            uri: "https://www.googleapis.com/customsearch/v1",
            json: true,
            qs: {
                cx: context.config.GOOGLE_CX,
                key: context.config.GOOGLE_KEY,
                q: params
            }
        };

        const result = await rp.get(options),
            items = result["items"].filter(item => item.kind === "customsearch#result"),
            quickReplies = [];

        for(let i = 0; i < items.length; ++i) {
            quickReplies.push({
                content_type: "text",
                title: (i + 1).toString(),
                payload: `!fetchpage ${items[i].formattedUrl}`
            });

            await context.send.sendText(sender_psid, `(${i + 1}) ${items[i].title}\n${items[i].snippet}`, i === items.length - 1 ? quickReplies : null);
        }
    } catch(err) {
        console.log(err);
        await context.send.sendText(sender_psid, "No results found.");
    } finally {
        await context.send.sendTypingIndicator(sender_psid, false);
    }
};

const fetchpage = async (context, sender_psid, params) => {
    try {
        await context.send.sendTypingIndicator(sender_psid, true);

        const page = await rp.get(params),
            content = h2p(page);

        await context.send.sendText(sender_psid, content);
    } catch(err) {
        await context.send.sendText(sender_psid, "Unable to retrieve page, please try again later.");
    } finally {
        await context.send.sendTypingIndicator(sender_psid, false);
    }
};

const duckduckgo = async (context, sender_psid, params) => {
    if(!params || !/\S/.test(params)) {
        await context.send.sendText(sender_psid, "Enter  your search terms. (Example: !duckduckgo Nisio Isin)");
        return;
    }

    try {
        await context.send.sendTypingIndicator(sender_psid, true);

        const result = await rp.get({
            uri: "https://api.duckduckgo.com/",
            json: true,
            qs: {
                q: params,
                format: "json",
                t: "yotsugi"
            }
        });

        await context.send.sendText(sender_psid, `${result.AbstractSource}\n${result.AbstractText}`);
    } catch(err) {
        await context.send.sendText(sender_psid, "No results found.");
    } finally {
        await context.send.sendTypingIndicator(sender_psid, false);
    }
};

const wanikani = async (context, sender_psid, params) => {
    if(params) {
        if(/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/.test(params)) {
            await database.setWaniKaniKey(sender_psid, params);
            await context.send.sendText(sender_psid, "Successfully set WaniKani API key.");
            return;
        } else {
            await context.send.sendText(sender_psid, "Invalid WaniKani API key.");
            return;
        }
    }

    const api_key = await database.getWaniKaniKey(sender_psid);
    if(!api_key) {
        await context.send.sendText(sender_psid, "WaniKani API key not found, please set an API Key first using !wanikani <api_key>.");
        return;
    }

    try {
        await context.send.sendTypingIndicator(sender_psid, true);

        const wanikani = WaniKani(api_key),
            response = await wanikani.user();

        await context.send.sendText(sender_psid, `${response.data.username}\nLevel: ${response.data.level}\nStarted at: ${moment(response.data.started_at).format("d MMMM YYYY")}`);
    } catch(err) {
        await context.send.sendText(sender_psid, "Unable to get user data from WaniKani.");
    } finally {
        await context.send.sendTypingIndicator(sender_psid, false);
    }
};

const help = async(context, sender_psid, params) => {
    if(!params || !/\S/.test(params)) {
        await context.send.sendText(sender_psid, "Enter the name of the command you need help with. (Example: !help callme)");
        return;
    }

    await context.send.sendText(sender_psid, "Command documentation is not available at the moment. Please visit the page for the full list of commands and their usage.");
    await context.send.sendTemplate(sender_psid, [
        {
            title: "Yotsugi",
            image_url: "https://s3-us-west-2.amazonaws.com/yotsugi.caguicla.me/logo.png",
            subtitle: "A multi-purpose Messenger bot.",
            default_action: {
                type: "web_url",
                url: "https://www.facebook.com/YotsugiBot/",
                webview_height_ratio: "tall"
            }
        }
    ]);
};

module.exports = {
    translate,
    wikipedia,
    weather,
    callme,
    google,
    fetchpage,
    wanikani,
    help
};
