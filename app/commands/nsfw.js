"use strict";

const rp = require("request-promise"),
      messenger = require("../messenger"),
      config = require("../../config");

const gelbooru = async (sender_psid, params) => {
    try {
        await messenger.sendTypingIndicator(sender_psid, true);

        const images = await rp({
            uri: `https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&tags=${encodeURIComponent(params)}&api_key=${config.GELBOORU_KEY}&user_id=${config.GELBOORU_USERID}`,
            json: true
        }),
              index = Math.floor(Math.random() * res.length),
              url = images[index].file_url;

        await messenger.sendAttachmentFromURL(sender_psid, "image", url);
    } catch(err) {
        await messenger.sendText(sender_psid, "No image with specified tags found!");
    } finally {
        await messenger.sendTypingIndicator(sender_psid, false);
    }
};

const yandere = async (sender_psid, params) => {
};

const danbooru = async (sender_psid, params) => {
};

const rule34 = async (sender_psid, params) => {
};

const sankakucomplex = async (sender_psid, params) => {
};

module.exports = {
    gelbooru,
    yandere,
    danbooru,
    rule34,
    sankakucomplex
};