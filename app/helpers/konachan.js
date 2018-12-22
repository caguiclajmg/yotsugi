"use strict";

const rp = require("request-promise");

class Konachan {
    constructor() {
        this._base_uri = "https://konachan.com";
    }

    async _call(endpoint, options) {
        return await rp.get({
            uri: `${this._base_uri}${endpoint}`,
            json: true,
            qs: options
        });
    }

    async posts_list(options) {
        return await this._call("/post.json", options);
    }
}

module.exports = exports = {
    Konachan
};
