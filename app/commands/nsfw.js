"use strict";

const rp = require("request-promise"),
    { Gelbooru } = require("../helpers/gelbooru");

const gelbooru = async (context, sender_psid, params) => {
    try {
        await context.send.sendTypingIndicator(sender_psid, true);

        const gelbooru = new Gelbooru(context.config.GELBOORU_KEY, context.config.GELBOORU_USERID),
            images = await gelbooru.posts_list({
                tags: params
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

module.exports = exports = {
    gelbooru,
    yandere,
    danbooru,
    rule34,
    sankakucomplex
};
