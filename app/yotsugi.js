"use strict";

const express = require("express"),
    bodyParser = require("body-parser"),
    Facebook = require("./helpers/facebook");

module.exports = exports = class Yotsugi {
    constructor(config) {
        this._config = config;

        this._app = express();
        this._app.use(bodyParser.json());

        this._app.use(require("./routes/main"));

        this._app.set("context", {
            app: this,
            config: this._config,
            send: new Facebook.Send(config.APP_PAGE_TOKEN)
        });
    }

    run() {
        this._app.listen(this._config.PORT, () => {
            console.log("Starting Yotsugi...");
        });
    }
};
