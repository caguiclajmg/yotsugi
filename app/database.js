"use strict";

const pgp = require("pg-promise")(),
      config = require("../config");

const db = pgp(config.DATABASE_URL);

const getNickname = async(sender_psid) => {
    return await db.oneOrNone("SELECT nickname FROM consumer WHERE psid = ${psid}", { psid: sender_psid }, consumer => consumer.nickname);
};

const setNickname = async(sender_psid, nickname) => {
    if(!nickname || !/\S/.test(nickname)) {
        await db.any("DELETE FROM consumer WHERE psid = ${psid}", { psid: sender_psid });
        return;
    }

    await db.any("INSERT INTO consumer (psid, nickname) VALUES (${psid}, ${nickname}) ON CONFLICT (psid) DO UPDATE SET nickname = ${nickname};", {
        psid: sender_psid,
        nickname: nickname
    });
};

const getWaniKaniKey = async(sender_psid) => {
    return await db.oneOrNone("SELECT api_key FROM wanikani WHERE consumer = ${psid}", { psid: sender_psid }, row => row ? row.api_key : null);
};

const setWaniKaniKey = async(sender_psid, key) => {
    if(!key || !/\S/.test(key)) {
        await db.any("DELETE FROM wanikani WHERE consumer = ${psid}", { psid: sender_psid });
        return;
    }

    await db.any("INSERT INTO wanikani (consumer, api_key) VALUES (${psid}, ${key}) ON CONFLICT (consumer) DO UPDATE SET api_key = ${key}", {
        psid: sender_psid,
        key: key
    });
};

module.exports = {
    getNickname,
    setNickname,
    getWaniKaniKey,
    setWaniKaniKey
};