"use strict";

const express = require("express"),
    bodyParser = require("body-parser"),
    config = require("../config"),
    { Send } = require("./helpers/facebook");

module.exports = exports = class Yotsugi {
    constructor() {
        this._app = express();
        this._app.use(bodyParser.json());

        this._app.use(require("./routes/main"));

        this._app.set("context", {
            app: this,
            config: config,
            send: new Send(config.APP_PAGE_TOKEN)
        });
    }

    run() {
        this._app.listen(config.PORT, () => {
            console.log("Starting Yotsugi...");
        });
    }
};
