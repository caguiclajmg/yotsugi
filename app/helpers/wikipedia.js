"use strict";

const rp = require("request-promise");

class Wikipedia {
    constructor() {

    }

    async _call(options) {
        return await rp.get({
            uri: "https://en.wikipedia.org/w/api.php",
            json: true,
            qs: Object.assign({}, options, {
                format: "json",
                utf8: 1
            })
        });
    }

    async query(sr) {
        return await this._call({
            action: "query",
            list: "search",
            srsearch: sr
        });
    }

    async parse(title) {
        return await this._call({
            action: "parse",
            prop: "text",
            page: title
        });
    }
}

module.exports = exports = {
    Wikipedia
};
