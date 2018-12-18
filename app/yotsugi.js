"use strict";

const express = require("express"),
    bodyParser = require("body-parser"),
    config = require("../config");

module.exports = exports = class Yotsugi {
    constructor() {
        this._app = express();
        this._app.use(bodyParser.json());

        this._app.use(require("./routes/main"));
    }

    run() {
        this._app.listen(config.PORT, () => {
            console.log("Starting Yotsugi...");
        });
    }
};
