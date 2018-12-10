"use strict";

const rp = require("request-promise"),
      messenger = require("../messenger"),
      config = require("../../config");

const gelbooru = (sender_psid, params) => {
    return rp({
        "uri": `https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&tags=${encodeURIComponent(params)}&api_key=${config.GELBOORU_KEY}&user_id=${config.GELBOORU_USERID}`,
        "json": true
        })
        .then((res) => {
            const index = Math.floor(Math.random() * Math.floor(res.length)),
                  url = res[index].file_url;

            messenger.sendAttachmentFromURL(sender_psid, "image", url);
        })
        .catch((err) => {
            messenger.sendText(sender_psid, "Unable to fetch results from Gelbooru!");
        });
}

const yandere = (sender_psid, params) => {
}

const danbooru = (sender_psid, params) => {
}

const rule34 = (sender_psid, params) => {
}

const sankakucomplex = (sender_psid, params) => {
}

module.exports = {
    gelbooru,
    yandere,
    danbooru,
    rule34,
    sankakucomplex
}