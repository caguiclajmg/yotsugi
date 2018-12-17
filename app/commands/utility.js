"use strict";

const rp = require("request-promise"),
      h2p = require("html2plaintext"),
      config = require("../../config"),
      messenger = require("../messenger"),
      database = require("../database");

const translate = async (sender_psid, params) => {
    let [lang, ...text] = params.split(" ");
    text = text.join(" ");

    if(!lang || !text) {
        await messenger.sendText(sender_psid, "Enter the destination language and the text you want to translate. (Example: !translate en こんにちは)");
        return;
    }

    try {
        await messenger.sendTypingIndicator(sender_psid, true);

        const translation = await rp.get({
            uri: `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${config.YANDEX_TRANSLATE_KEY}&text=${encodeURIComponent(text)}&lang=${lang}`,
            json: true
        });

        await messenger.sendText(sender_psid, `${translation.text[0]}\n\nPowered by Yandex.Translate`);
    } catch(err) {
        await messenger.sendText(sender_psid, "Unable to translate text, please try again later.");
    } finally {
        await messenger.sendTypingIndicator(sender_psid, false);
    }
};

const wikipedia = async (sender_psid, params) => {
    if(!params || !/\S/.test(params)) {
        await messenger.sendText(sender_psid, "Enter the name of the article to look up. (Example: !wikipedia Nisio Isin)");
        return;
    }

    try {
        await messenger.sendTypingIndicator(sender_psid, true);

        const articles = await rp.get({
            uri: `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=${encodeURIComponent(params)}`,
            json: true
        });

        if(articles.query.search.length === 0) {
            await messenger.sendText(sender_psid, "No articles with specified title found.");
            return
        }

        const article = await rp.get({
            uri: `https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&page=${articles.query.search[0].title}`,
            json: true
        });

        const text = h2p(article.parse.text["*"]);
        await messenger.sendText(sender_psid, text);
    } catch(err) {
        await messenger.sendText(sender_psid, "Unable to get article from Wikipedia, please try again later.");
    } finally {
        await messenger.sendTypingIndicator(sender_psid, false);
    }
};

const weather = async (sender_psid, params) => {
    if(!/[0-9]+,[a-zA-Z]{2}$/.test(params)) {
        await messenger.sendText(sender_psid, "Enter your ZIP code and 2-letter country code. (Example: !weather 4024,ph)");
        return;
    }

    try {
        await messenger.sendTypingIndicator(sender_psid, true);

        const weather = await rp.get({
            uri: `https://api.openweathermap.org/data/2.5/weather?zip=${params}&appid=${config.OPENWEATHERMAP_KEY}`,
            json: true
        });

        await messenger.sendText(sender_psid, `${weather.name} Weather\nType: ${weather.weather[0].main} (${weather.weather[0].description})\nTemperature: ${weather.main.temp - 273.15}C`);
    } catch(err) {
        await messenger.sendText(sender_psid, "Unable to get weather data from OpenWeatherMap, please try again later.");
    } finally {
        await messenger.sendTypingIndicator(sender_psid, false);
    }
};

const callme = async (sender_psid, params) => {
    try {
        await database.setNickname(sender_psid, params);
        await messenger.sendText(sender_psid, params ? `I will now call you ${params}!` : "You removed your nickname.");
    } catch(err) {
        await messenger.sendText(sender_psid, "I'm currently unable to set your nickname, please try again later.");
    }
};

const google = async (sender_psid, params) => {
    if(!params || !/\S/.test(params)) {
        await messenger.sendText(sender_psid, "Enter your search terms. (Example: !google Nisio Isin)");
        return;
    }

    try {
        await messenger.sendTypingIndicator(sender_psid, true);

        const options = {
            uri: "https://www.googleapis.com/customsearch/v1",
            json: true,
            qs: {
                cx: config.GOOGLE_CX,
                key: config.GOOGLE_KEY,
                q: params
            }
        };

        const result = await rp.get(options),
              items = result["items"];

        for(let i = 0; i < items.length; ++i) {
            if(items[i].kind !== "customsearch#result") continue;

            await messenger.sendText(sender_psid, `${items[i].title}\n${items[i].snippet}`);
        }
    } catch(err) {
        await messenger.sendText(sender_psid, "No results found.");
    } finally {
        await messenger.sendTypingIndicator(sender_psid, false);
    }
};

const duckduckgo = async (sender_psid, params) => {
    if(!params || !/\S/.test(params)) {
        await messenger.sendText(sender_psid, "Enter  your search terms. (Example: !duckduckgo Nisio Isin)");
        return;
    }

    try {
        await messenger.sendTypingIndicator(sender_psid, true);

        const result = await rp.get({
            uri: "https://api.duckduckgo.com/",
            json: true,
            qs: {
                q: params,
                format: "json",
                t: "yotsugi"
            }
        });

        await messenger.sendText(sender_psid, `${result.AbstractSource}\n${result.AbstractText}`);
    } catch(err) {
        await messenger.sendText(sender_psid, "No results found.");
    } finally {
        await messenger.sendTypingIndicator(sender_psid, false);
    }
};

const wanikani = async (sender_psid, params) => {
    if(params && /\S/.test(params)) {
        try {
            await database.setWaniKaniKey(sender_psid, params);
            await messenger.sendText(sender_psid, "Successfully set WaniKani API key.");
        } catch(err) {
            console.log(err);
            await messenger.sendText(sender_psid, "Unable to set WaniKani API key.");
        }

        return;
    }

    const api_key = await database.getWaniKaniKey(sender_psid);
    if(!api_key) {
        await messenger.sendText(sender_psid, "WaniKani API key not found, please set an API Key first using !wanikani <api_key>.");
        return;
    }

    try {
        await messenger.sendTypingIndicator(sender_psid, true);

        const response = await rp.get({
            uri: "https://api.wanikani.com/v2/user",
            json: true,
            headers: {
                Authorization: `Bearer ${api_key}`
            }
        });

        await messenger.sendText(sender_psid, `${response.data.username}\nLevel: ${response.data.level}\nStarted at: ${response.data.started_at}`);
    } catch(err) {
        await messenger.sendText(sender_psid, "Unable to get user data from WaniKani.");
    } finally {
        await messenger.sendTypingIndicator(sender_psid, false);
    }
};

const help = async(sender_psid, params) => {
    if(!params || !/\S/.test(params)) {
        await messenger.sendText(sender_psid, "Enter the name of the command you need help with. (Example: !help callme)");
        return;
    }

    await messenger.sendText(sender_psid, "Command documentation is not available at the moment. Please visit the page for the full list of commands and their usage.");
    await messenger.sendTemplate(sender_psid, [
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
    wanikani,
    help
};