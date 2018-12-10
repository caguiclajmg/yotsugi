"use strict";

const rp = require("request-promise"),
      config = require("../config");

const sendResponse = (sender_psid, response) => {
    const payload = Object.assign({}, {
        recipient: {
            id: sender_psid
        }
    }, response);

    return rp({
        uri: "https://graph.facebook.com/v2.6/me/messages",
        qs: { access_token: config.APP_PAGE_TOKEN },
        method: "POST",
        json: payload
    });
};

const sendText = (sender_psid, text) => {
    return sendResponse(sender_psid, {
        message: {
            text: text
        }
    });
};

const sendAttachmentFromURL = (sender_psid, type, url, is_reusable = true) => {
    return sendResponse(sender_psid, {
        message: {
            attachment: {
                type: type,
                payload: {
                    url: url,
                    is_reusable: is_reusable
                }
            }
        }
    });
}

const sendTypingIndicator = (sender_psid, status) => {
    return sendResponse(sender_psid, {
        sender_action: status ? "typing_on" : "typing_off"
    });
}

module.exports = {
    sendResponse,
    sendText,
    sendAttachmentFromURL,
    sendTypingIndicator
};