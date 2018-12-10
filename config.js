"use strict";

module.exports = {
    "PORT": process.env.PORT || 5000,
    "APP_SECRET": process.env.APP_SECRET,
    "APP_VERIFY_TOKEN": process.env.APP_VERIFY_TOKEN,
    "APP_PAGE_TOKEN": process.env.APP_PAGE_TOKEN,
    "GELBOORU_KEY": process.env.GELBOORU_KEY,
    "GELBOORU_USERID": process.env.GELBOORU_USERID,
    "YANDEX_TRANSLATE_KEY": process.env.YANDEX_TRANSLATE_KEY,
    "COMMAND_PREFIX": process.env.COMMAND_PREFIX || '!'
}