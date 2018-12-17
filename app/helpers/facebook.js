"use strict";

const rp = require("request-promise");

class Send {
    constructor(page_access_token) {
        this._page_access_token = page_access_token;
    }

    async send(psid, response) {
        return await rp.post({
            uri: "https://graph.facebook.com/v2.6/me/messages",
            json: true,
            qs: {
                access_token: this._page_access_token
            },
            json: Object.assign({}, response, {
                recipient: {
                    id: psid
                }
            })
        });
    }

    async sendText(psid, text) {
        const chunks = text.match(/.{1,2000}/gs),
              responses = [];

        for(let i = 0; i < chunks.length; ++i) {
            responses.push(await this.send(psid, {
                message: {
                    text: chunk
                }
            }));
        }

        return responses;
    }
};

module.exports = exports = {
    Send
}
