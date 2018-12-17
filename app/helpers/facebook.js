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

    async sendAttachment(psid, type, attachment) {
        return await this.send(psid, {
            message: {
                attachment: {
                    type: type,
                    payload: attachment
                }
            }
        });
    }

    async sendAttachmentFromURL(psid, type, url, reusable = false) {
        return await this.sendAttachment(psid, type, {
            url: url,
            is_reusable: reusable
        });
    }

    async sendTemplate(psid, elements) {
        return await this.sendAttachment(psid, "template", {
            template_type: "generic",
            elements: elements
        });
    }

    async sendSenderAction(psid, sender_action) {
        return await this.sendResponse(psid, {
            sender_action: sender_action
        });
    }

    async sendTypingIndicator(psid, state) {
        return await this.sendSenderAction(psid, state ? "typing_on" : "typing_off");
    }

    async sendSeenIndicator(psid, state) {
        return await this.sendSenderAction(psid, "mark_seen");
    }
};

module.exports = exports = {
    UserProfile,
    Send
}
