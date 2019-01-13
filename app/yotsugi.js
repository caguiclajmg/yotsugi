"use strict";

const express = require("express"),
    bodyParser = require("body-parser"),
    database = require("./database"),
    Facebook = require("./helpers/facebook");

module.exports = exports = class Yotsugi {
    constructor() {
        this._app = express();
        this._app.use(bodyParser.json());

        this._app.use(require("./routes/main"));

        this._app.set("context", {
            app: this,
            send: new Facebook.Send(process.env.APP_PAGE_TOKEN),
            database: database
        });
    }

    run() {
        this._app.listen(process.env.PORT || 5000, () => {
            console.log("Starting Yotsugi...");
        });
    }
};
