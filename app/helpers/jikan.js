"use strict";

const rp = require("request-promise");

class Jikan {
    constructor() {
        this._base_uri = "https://api.jikan.moe/v3";
    }

    async _query(endpoint, options) {
        return await rp.get({
            uri: `${this._base_uri}${endpoint}`,
            json: options.json ? options.json.toString() === "1" : false,
            qs: options
        });
    }

    async season(year, season) {
        return await this._query(`${year}/${season}`, {
            json: true
        });
    }
}

module.exports = exports = {
    Jikan
};
