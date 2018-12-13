"use strict";

const rp = require("request-promise"),
      messenger = require("../messenger"),
      config = require("../../config");

const ratewaifu = async (sender_psid, params) => {
    if(!params) {
        await messenger.sendText(sender_psid, "Type in the name of your waifu.\n\nExample: !ratewaifu Satania");
        return;
    }

    if(params.toUpperCase() === 'Satania'.toUpperCase()) {
        await messenger.sendText(sender_psid, "Ah, I see you're a デビル of culture as well.");
        await messenger.sendAttachmentFromURL(sender_psid, "video", "https://simg3.gelbooru.com//images/7e/30/7e30b74b172268369138ff0ed078bf9a.webm");
        return;
    }

    if(params.toUpperCase() === 'Yotsugi'.toUpperCase()) {
        await messenger.sendText(sender_psid, "Yay~ Peace, Peace!");
        await messenger.sendAttachmentFromURL(sender_psid, "image", "https://simg3.gelbooru.com//images/04/ea/04eab4e28d24fe39ea79018fd29d6009.gif");
        return;
    }

    const score = Math.floor(Math.random() * 11);

    let rating;

    if(score <= 2) {
        rating = `${params} is trash and you have shit taste. ${score}/10`;
    } else if(score >= 3 && score <= 4) {
        rating = `Normie taste, but ok. I'd give ${params} a ${score}/10.`;
    } else if(score >= 5 && score <= 6) {
        rating = `I'd say ${params} is a decent ${score}/10 waifu.`;
    } else if(score >= 7 && score <= 8) {
        rating = `${params} is a qt, ${score}/10 waifu.`;
    } else if(score >= 9 && score <= 10) {
        rating = `Of course, ${params} is best girl. ${score}/10`;
    } else {
        rating = `I'd rate ${params} a ${score}/10`;
    }

    await messenger.sendText(sender_psid, rating);
};

const safebooru = async (sender_psid, params) => {
    try {
        await messenger.sendTypingIndicator(sender_psid, true);

        const results = await rp.get({
            uri: `https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&limit=200&tags=${encodeURIComponent(params + " rating:safe")}`,
            json: true
        });

        if(!results) throw new Error();

        const index = Math.floor(Math.random() * Math.floor(results.length)),
              result = results[index],
              url = `https://safebooru.org//images/${result.directory}/${result.image}`;

        await messenger.sendAttachmentFromURL(sender_psid, "image", url);
    } catch(err) {
        await messenger.sendText(sender_psid, "No images with specified tags found.");
    } finally {
        await messenger.sendTypingIndicator(sender_psid, false);
    }
};

const EIGHTBALL_REPLIES = [
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes - definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes.",
    "Signs point to yes.",

    "Reply hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",

    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful."
];

const eightball = async (sender_psid, params) => {
    if(!params || !/\S/.test(params)) {
        await messenger.sendText(sender_psid, "Please enter your question. (Example: !eightball Are traps gay?)");
        return;
    }

    const index = Math.floor(Math.random() * (EIGHTBALL_REPLIES.length + 1)),
          reply = EIGHTBALL_REPLIES[index];

    await messenger.sendText(sender_psid, reply);
};

const flipcoin = async(sender_psid, params) => {
};

module.exports = {
    ratewaifu,
    safebooru,
    eightball
};