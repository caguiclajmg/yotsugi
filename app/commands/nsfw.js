"use strict";

const request = require("request"),
      messenger = require("../messenger"),
      config = require.main;

function gelbooru(sender_psid, params) {
    messenger.sendAttachmentFromURL(sender_psid, "image", "https://simg3.gelbooru.com/images/93/bf/93bf1ae55ac54406fd1bf3b950cf782c.jpg");
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