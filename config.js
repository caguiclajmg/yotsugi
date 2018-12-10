"use strict";

module.exports = {
    "PORT": process.env.PORT || 5000,
    "APP_SECRET": process.env.APP_SECRET,
    "APP_VERIFY_TOKEN": process.env.APP_VERIFY_TOKEN,
    "APP_PAGE_TOKEN": process.env.APP_PAGE_TOKEN,
    "COMMAND_PREFIX": process.env.COMMAND_PREFIX || '!'
}