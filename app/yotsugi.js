'use strict';

function run() {
    const express = require('express'),
          config = require(`${__base}config`),
          app = express();

    app.use(require("body-parser").json());
    app.use(require(`${__base}app/routes/main`));
    app.listen(config.PORT, () => console.log("Starting server..."));
}

module.exports = run;