"use strict";

const rp = require("request-promise"),
      messenger = require("../messenger"),
      config = require.main;

function gelbooru(sender_psid, params) {
    return rp({
        "uri": `https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&tags=${encodeURIComponent(params)}&api_key=${process.env.GELBOORU_KEY}&user_id=${process.env.GELBOORU_USERID}`,
        "json": true)
        .then((res) => {
            const index = Math.floor(Math.random() * Math.floor(res.length)),
                  url = res[index].file_url;

            messenger.sendAttachmentFromURL(sender_psid, "image", url);
        })
        .catch((err) => {
            messenger.sendText(sender_psid, "Unable to fetch results from Gelbooru!");
        });
}

function yandere(sender_psid, params) {
}

function danbooru(sender_psid, params) {
}

function rule34(sender_psid, params) {
}

function sankakucomplex(sender_psid, params) {
}

module.exports = {
    "gelbooru": gelbooru,
    "yandere": yandere,
    "danbooru": danbooru,
    "rule34": rule34,
    "sankakucomplex": sankakucomplex
}