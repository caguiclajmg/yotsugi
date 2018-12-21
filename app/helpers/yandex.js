"use strict";

const rp = require("request-promise");

class Translate {
    constructor(key) {
        this._key = key;
        this._base_uri = "https://translate.yandex.net/api/v1.5/tr.json";
    }

    async _call(endpoint, options) {
        return await rp.get({
            uri: `${this._base_uri}${endpoint}`,
            json: true,
            qs: Object.assign({}, options, {
                key: this._key,
            })
        });
    }

    async translate(lang, text) {
        return await this._call("/translate", {
            text: text,
            lang: lang
        });
    }

    async detect(text, hint) {
        return await this._call("/detect", {
            text: text,
            hint: hint
        });
    }
}

module.exports = exports = {
    Translate
};
