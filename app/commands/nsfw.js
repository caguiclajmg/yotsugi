"use strict";

const rp = require("request-promise");

const gelbooru = async (context, sender_psid, params) => {
    try {
        await context.send.sendTypingIndicator(sender_psid, true);

        const images = await rp({
                uri: "https://gelbooru.com/index.php",
                json: true,
                qs: {
                    page: "dapi",
                    s: "post",
                    q: "index",
                    json: 1,
                    tags: params,
                    api_key: context.config.GELBOORU_KEY,
                    user_id: context.config.GELBOORU_USERID
                }
            }),
            index = Math.floor(Math.random() * images.length),
            url = images[index].file_url;

        await context.send.sendAttachmentFromURL(sender_psid, "image", url);
    } catch(err) {
        await context.send.sendText(sender_psid, "No image with specified tags found!");
    } finally {
        await context.send.sendTypingIndicator(sender_psid, false);
    }
};

const yandere = async (context, sender_psid, params) => {
};

const danbooru = async (context, sender_psid, params) => {
};

const rule34 = async (context, sender_psid, params) => {
};

const sankakucomplex = async (context, sender_psid, params) => {
};

module.exports = {
    gelbooru,
    yandere,
    danbooru,
    rule34,
    sankakucomplex
};
