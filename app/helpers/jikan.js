"use strict";

const rp = require("request-promise");

class JikanRateLimitException extends Error {
    RateLimitException(message, data) {
        this.name = "RateLimitException";
        this.message = message;
        this.data = data;
    }
}

class Jikan {
    constructor() {
        this._base_uri = "https://api.jikan.moe/v4";
    }

    async _query(endpoint, options) {
        const now = new Date();

        if(now.getTime() - Jikan._last_query.getTime() < 2000) throw new JikanRateLimitException();

        Jikan._last_query = now;

        const response = await rp.get({
            uri: `${this._base_uri}${endpoint}`,
            json: options.json,
            qs: options.qs
        });

        return response;
    }

    async season(year, season) {
        return await this._query(`/seasons/${year}/${season}`, {
            json: true
        });
    }

    async search(type, query, filters) {
        return await this._query(`/anime?type=${type}&q=${encodeURIComponent(query)}&page=1`, {
            json: true,
            qs: filters
        });
    }
}

Jikan._last_query = new Date();

module.exports = exports = {
    Jikan,
    JikanRateLimitException
};
