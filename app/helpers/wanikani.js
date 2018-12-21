"use strict";

const rp = require("request-promise");

class WaniKani {
    constructor(api_key) {
        this.api_key = api_key;
        this.base_uri = "https://api.wanikani.com/v2";
    }

    async _call(endpoint, options) {
        return await rp.get(Object.assign({}, options, {
            uri: `${this.base_uri}${endpoint}`,
            json: true,
            headers: Object.assign({}, options ? options.headers : null, {
                Authorization: `Bearer ${this.api_key}`
            })
        }));
    }

    async user() {
        return await this._call("/user");
    }

    async subjects(filters) {
        return await this._call("/subjects", {
            json: filters
        });
    }

    async assignments(filters) {
        return await this._call("/assignments", {
            json: filters
        });
    }

    async review_statistics(filters) {
        return await this._call("/review_statistics", {
            json: filters
        });
    }

    async study_materials(filters) {
        return await this._call("/study_materials", {
            json: filters
        });
    }

    async summary() {
        return await this._call("/summary");
    }

    async reviews(filters) {
        return await this._call("/reviews", {
            json: filters
        });
    }

    async level_progressions(filters) {
        return await this._call("/level_progressions", {
            json: filters
        });
    }

    async resets(filters) {
        return await this._call("/resets", {
            json: filters
        });
    }

    async srs_stages() {
        return await this._call("/srs_stages");
    }
}

module.exports = exports = {
    WaniKani
};
