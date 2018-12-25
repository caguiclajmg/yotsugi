"use strict";

const rp = require("request-promise");

class Gelbooru {
    constructor(api_key, user_id) {
        this.api_key = api_key;
        this.user_id = user_id;
    }

    async _query(options) {
        return await rp.get({
            uri: "https://gelbooru.com/index.php",
            json: options.json ? options.json.toString() === "1" : false,
            qs: Object.assign({}, options, {
                page: "dapi",
                q: "index",
                api_key: this.api_key,
                user_id: this.user_id
            })
        });
    }

    async posts_list(options) {
        return await this._query(Object.assign({}, options, {
            s: "post",
            json: 1
        }));
    }

    async posts_deleted(options) {
        return await this._query(Object.assign({}, options, {
            s: "post",
            deleted: "show"
        }));
    }

    async comments_list(options) {
        return await this._query(Object.assign({}, options, {
            s: "comment"
        }));
    }
}

module.exports = exports = {
    Gelbooru
};
