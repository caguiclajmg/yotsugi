"use strict";

function run() {
    const express = require("express"),
        config = require("../config"),
        app = express();

    app.use(require("body-parser").json());
    app.use(require("./routes/main"));
    app.listen(config.PORT, () => console.log("Starting server..."));
}

module.exports = run;
