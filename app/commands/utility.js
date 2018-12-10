"use strict";

const rp = require("request-promise"),
      messenger = require("../messenger"),
      config = require.main;

function translate(sender_psid, params) {
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

module.exports = {
    "translate": translate,
}