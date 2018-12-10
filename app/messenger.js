"use strict";

const rp = require("request-promise"),
      config = require("../config");

const MAX_MESSAGE_LENGTH = 2000;
const MAX_CHUNK_COUNT = 8;

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
    const chunksCount = Math.min(Math.ceil(text.length / MAX_MESSAGE_LENGTH), MAX_CHUNK_COUNT),
          chunks = new Array(chunksCount),
          sendChunks = (sender_psid, chunks, index = 0) => {
              console.log(`Sending chunk ${index}`);
              sendResponse(sender_psid, {
                  message: {
                      text: chunks[index]
                  }
              })
              .then((res) => {
                  if(index < chunks.length - 1) sendChunks(sender_psid, chunks, ++index);
              });
          };

    for(let i = 0; i < chunksCount; ++i) {
        chunks[i] = text.substr(i * MAX_MESSAGE_LENGTH, MAX_MESSAGE_LENGTH);
    }

    sendChunks(sender_psid, chunks);
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