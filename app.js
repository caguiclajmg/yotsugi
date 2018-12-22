"use strict";

const Yotsugi = require("./app/yotsugi"),
    config = require("./config"),
    yotsugi = new Yotsugi(config);

yotsugi.run();
