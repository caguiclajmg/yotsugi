"use strict";

const rp = require("request-promise"),
      messenger = require("../messenger"),
      config = require("../../config");

const ratewaifu = (sender_psid, params) => {
    if(!params) {
        messenger.sendText(sender_psid, "Type in the name of your waifu.\n\nExample: !ratewaifu Satania");
    } else if(params.toUpperCase() === "Satania".toUpperCase() ||
       params.toUpperCase() === "Satanichia Kurumizawa McDowell".toUpperCase()) {
        messenger.sendAttachmentFromURL(sender_psid, "video", "https://simg3.gelbooru.com//images/7e/30/7e30b74b172268369138ff0ed078bf9a.webm");
        messenger.sendText(sender_psid, "Ah, I see you're a デビル of culture as well.");
    } else {
        let rating;
        const score = Math.floor(Math.random() * 11);

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

        messenger.sendText(sender_psid, rating);
    }
}

const safebooru = (sender_psid, params) => {
    return rp({
        "uri": `https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&limit=200&tags=${encodeURIComponent(params + " rating:safe")}`,
        "json": true
        })
        .then((res) => {
            const index = Math.floor(Math.random() * Math.floor(res.length)),
                  url = `https://safebooru.org//images/${res[index].directory}/${res[index].image}`

            messenger.sendAttachmentFromURL(sender_psid, "image", url);
        })
        .catch((err) => {
            messenger.sendText(sender_psid, "Unable to fetch results from Safebooru!");
        });
}

module.exports = {
    ratewaifu,
    safebooru
}