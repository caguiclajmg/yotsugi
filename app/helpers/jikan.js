"use strict";

const rp = require("request-promise");

class Jikan {
    constructor() {
        this._base_uri = "https://api.jikan.moe/v3";
    }

    async _query(endpoint, options) {
        return await rp.get({
            uri: `${this._base_uri}${endpoint}`,
            json: options.json,
            qs: options.qs
        });
    }

    async season(year, season) {
        return await this._query(`/season/${year}/${season}`, {
            json: true
        });
    }

    async search(type, query, filters) {
        return await this._query(`/search/${type}/?q=${encodeURIComponent(query)}&page=1`, {
            json: true,
            qs: filters
        });
    }
}

module.exports = exports = {
    Jikan
};
