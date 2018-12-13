"use strict";

const rp = require("request-promise"),
      config = require("../config");

const MAX_MESSAGE_LENGTH = 2000;
const MAX_CHUNK_COUNT = 8;

const sendResponse = async (sender_psid, response) => {
    response.recipient = { id: sender_psid };

    const options = {
        uri: "https://graph.facebook.com/v2.6/me/messages",
        qs: {
            access_token: config.APP_PAGE_TOKEN
        },
        method: "POST",
        json: payload
    };

    return await rp(options);
};

const sendText = async (sender_psid, text) => {
    const chunks = text.match(new RegExp(`.{1,${MAX_MESSAGE_LENGTH}}`, "g"));

    let responses = new Array(chunks.length);
    for(let index = 0; index < chunks.length; ++i) {
        const payload = {
            message: {
                text: chunks[index]
            }
        };

        responses[index] = await sendResponse(sender_psid, payload);
    }

    return responses;
};

const sendAttachment = async (sender_psid, type, attachment) => {
    const payload = {
        message: {
            attachment: {
                type: type,
                payload: attachment
            }
        }
    };

    return await sendResponse(sender_psid, payload);
};

const sendAttachmentFromURL = async (sender_psid, type, url, reusable = false) => {
    const payload = {
        url: url,
        is_reusable: reusable
    };

    return await sendAttachment(sender_psid, payload);
};

const sendTemplate = async (sender_psid, elements) => {
    const payload = {
        template_type: "generic",
        elements: elements
    };

    return await sendAttachment(sender_psid, "template", payload);
};

const sendSenderAction = async (sender_psid, action) => {
    const payload = {
        sender_action: action
    };

    return await sendResponse(sender_psid, payload);
};

const sendTypingIndicator = async (sender_psid, status) => {
    return await sendSenderAction(sender_psid, status ? "typing_on" : "typing_off");
};

const sendSeenIndicator = async(sender_psid, status) => {
    return await sendSeenIndicator(sender_psid, "mark_seen");
};

module.exports = {
    sendResponse,
    sendText,
    sendAttachment,
    sendAttachmentFromURL,
    sendTemplate,
    sendTypingIndicator
};