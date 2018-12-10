"use strict";

const rp = require("request-promise"),
      h2p = require("html2plaintext"),
      messenger = require("../messenger"),
      config = require("../../config");

const translate = (sender_psid, params) => {
    let [lang, ...text] = params.split(" ");
    text = text.join(" ");

    return rp({
        "uri": `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${config.YANDEX_TRANSLATE_KEY}&text=${encodeURIComponent(text)}&lang=${lang}`,
        "json": true
        })
        .then((res) => {
            messenger.sendText(sender_psid, `${res.text[0]}\n\nPowered by Yandex.Translate`);
        })
        .catch((err) => {
            messenger.sendText(sender_psid, "Unable to translate text!");
        });
}

const wikipedia = (sender_psid, params) => {
    return rp({
        "uri": `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=${encodeURIComponent(params)}`,
        "json": true
        })
        .then((res) => {
            rp({
                "uri": `https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&page=${res.query.search[0].title}`,
                "json": true
                })
                .then((res) => {
                    var text = h2p(res.parse.text["*"]);
                    messenger.sendText(sender_psid, `${text}`);
                })
                .catch((err) => {
                    messenger.sendText(sender_psid, "Unable to fetch article!");
                });
        })
        .catch((err) => {
            messenger.sendText(sender_psid, "Unable to fetch article!");
        });
}

module.exports = {
    translate,
    wikipedia
}