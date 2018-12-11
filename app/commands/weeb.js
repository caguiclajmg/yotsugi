"use strict";

const rp = require("request-promise"),
      messenger = require("../messenger"),
      config = require("../../config");

const ratewaifu = (sender_psid, params) => {
    if(params.toUpperCase() === "Satania".toUpperCase() ||
       params.toUpperCase() === "Satanichia Kurumizawa McDowell".toUpperCase()) {
        messenger.sendAttachmentFromURL(sender_psid, "video", "https://simg3.gelbooru.com//images/7e/30/7e30b74b172268369138ff0ed078bf9a.webm");
        messenger.sendText(sender_psid, "Ah, I see you're a デビル of culture as well.");
    } else {
        let rating;
        const score = Math.floor(Math.random() * 10);

        if(score <= 2) {
            rating = `${params} is trash and you have shit taste. ${score}/10`;
        } else {
            rating = `I'd rate ${params} a ${score}/10`;
        }

        messenger.sendText(sender_psid, rating);
    }
}

module.exports = {
    ratewaifu,
}