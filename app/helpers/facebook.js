"use strict";

const rp = require("request-promise");

class Send {
    constructor(page_access_token) {
        this._page_access_token = page_access_token;
    }

    async send(psid, response) {
        return await rp.post({
            uri: "https://graph.facebook.com/v2.6/me/messages",
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

    async sendText(psid, text, quick_replies = null) {
        const chunks = text.match(/[\s\S]{1,2000}/g),
            responses = [];

        for(let i = 0; i < chunks.length; ++i) {
            const response = {
                message: {
                    text: chunks[i]
                }
            };

            if(i === chunks.length - 1 && quick_replies) response.message.quick_replies = quick_replies;

            responses.push(await this.send(psid, response));
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
        return await this.send(psid, {
            sender_action: sender_action
        });
    }

    async sendTypingIndicator(psid, state) {
        return await this.sendSenderAction(psid, state ? "typing_on" : "typing_off");
    }

    async sendSeenIndicator(psid) {
        return await this.sendSenderAction(psid, "mark_seen");
    }
}

module.exports = exports = {
    Send
};
