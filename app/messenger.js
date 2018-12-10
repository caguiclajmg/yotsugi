"use strict";

const rp = require("request-promise"),
      config = require("../config");

function sendResponse(sender_psid, response) {
    return rp({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": config.APP_PAGE_TOKEN },
        "method": "POST",
        "json": response
    });
}

function sendMessage(sender_psid, message) {
    return sendResponse(sender_psid, {
        "recipient": {
            "id": sender_psid
        },
        "message": message
    });
}

function sendTypingIndicator(sender_psid, status) {
    return sendResponse(sender_psid, {
        "recipient": {
            "id": sender_psid
        },
        "sender_action": status ? "typing_on" : "typing_off"
    });
}

module.exports = {
    "sendResponse": sendResponse,
    "sendMessage": sendMessage,
    "sendTypingIndicator": sendTypingIndicator
};