"use strict";

const rp = require("request-promise"),
      config = require("../config");

function sendResponse(sender_psid, response) {
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    };

    return request({
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