"use strict";

const rp = require("request-promise"),
      config = require("../config");

function sendResponse(sender_psid, response) {
    console.log(config.APP_PAGE_TOKEN);
    return rp({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "accesss_token": config.APP_PAGE_TOKEN },
        "method": "POST",
        "json": {
            "recipient": {
                "id": sender_psid
            },
            "message": response
        }
    });
}

module.exports = {
    "sendResponse": sendResponse
};