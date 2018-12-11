"use strict";

const rp = require("request-promise"),
      messenger = require("../messenger"),
      config = require("../../config");

const ratewaifu = (sender_psid, params) => {
    let score, rating;

    if(params.toUpperCase() === "Satania".toUpperCase() ||
       params.toUpperCase() === "Satanichia Kurumizawa McDowell".toUpperCase()) {
        score = 666;
        rating = "ASD";
    } else {
        score = Math.floor(Math.random() * 10);

        if(score <= 2) {
            rating = `${params} is trash and you have shit taste. ${score}/10`;
        } else {
            rating = `I'd rate ${params} a ${score}/10`;
        }
    }

    messenger.sendText(sender_psid, rating);
}

module.exports = {
    ratewaifu,
}